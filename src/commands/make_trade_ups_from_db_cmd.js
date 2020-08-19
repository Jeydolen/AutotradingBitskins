const _                      = require('lodash');
const assert                 = require ('assert');

const knex                   = rekwire ('/src/bb_database.js').knex_conn;
const Konst                  = rekwire ('/src/constants.js');
const SkinSet                = rekwire ('/src/model/skin_set').SkinSet;
const { konsole, LOG_LEVEL } = rekwire ('/src/bb_log.js');
const Command                = rekwire ('/src/commands/command.js').Command;
const TradeUp = rekwire ('/src/model/trade_up.js').TradeUp;


class MakeTradeUpsFromDBCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
        this.output = null;
    } // constructor


    async extractTradeUpsFromDB ( ctx )
    {
        let source_and_target_rows = await this.extractSourceAndTargetRowsFromDB( ctx );

        let source_rows = source_and_target_rows.sources;
        //assert( source_rows.length != 0 );

        let target_rows = source_and_target_rows.targets;
        //assert( target_rows.length != 0 );

        // target: [ source_decade ]
        let target_to_source_decade = this.extractPotentialProfitableTradeUps (  source_rows, target_rows );

        // trade_up_key : { skin_id : [ targets ] }
        let siblings_target_of_source_decade    = this.extractSiblingTargetsOfSourceDecade ( ctx, target_rows, target_to_source_decade );
        this.createTradeUps(ctx, target_to_source_decade, siblings_target_of_source_decade );

        return siblings_target_of_source_decade;
    } // extractTradeUpsFromDB


    // Creer une table pour les enregistrer dans la db ( peut etre MONGO car + rapide )
    async execute ( ctx )
    {       
        let result = null;
        console.log ( 'ctx.params : ' + JSON.stringify( ctx.params ) )
        if ( Object.keys(ctx.params).length != 0 )
            return await this.extractTradeUpsFromDB ( ctx );
        else
        {
            let skin_set_count = await SkinSet.GetRecordCount();
            konsole.log ( 'Ctx.params.length == 0, record_count : ' + skin_set_count, LOG_LEVEL.INFO);
            let ctx = { params : { skin_set : Konst.NULL_RECORD_ID +1, rarity : 1, state : 1, stattrak : false } }
            for ( let rarity_i = 1; rarity_i < 7; rarity_i++ )
            {
                ctx.params.rarity = rarity_i;

                for ( let state_i = 1; state_i < 6; state_i++)
                {
                    ctx.params.state = state_i;
                    for ( let skin_set_i = Konst.NULL_RECORD_ID +1; skin_set_i < skin_set_count; skin_set_i++)
                    {
                        ctx.params.skin_set = skin_set_i;
                        ctx.params.stattrak = false;
                        await this.extractTradeUpsFromDB ( ctx );
        
                        ctx.params.stattrak = true;
                        await this.extractTradeUpsFromDB ( ctx );
                    }
                }
               
            }

        }

        result = TradeUp.GetInstanceCount();

        return "TradeUps count: " + result;
    } // execute()


    async extractSourceAndTargetRowsFromDB( ctx )
    {
        let skin_set    = ctx.params.skinset    != undefined ? ctx.params.skinset   : 5;
        let rarity      = ctx.params.rarity     != undefined ? ctx.params.rarity    : 4;
        let state       = ctx.params.state      != undefined ? ctx.params.state     : 4;
        let stattrak    = ctx.params.stattrak   != undefined ? ctx.params.stattrak  : 1;

        let selectSellOrder_subquery_1  =   null;
        let selectSellOrder_subquery_2  =   null;

        this.output = "<html><body><p>Results:</p><ol>";


        const defaultExtractSellOrderAttribute_CB = ( sell_order, attribute_name = 'id' ) => { return sell_order[attribute_name]; };

        const logResult = ( sell_orders, msg, cb = defaultExtractSellOrderAttribute_CB ) =>
        {
            console.log ( sell_orders )
            this.output += "<p>" + msg + "</p><ol>";
            sell_orders.map
            ( sell_order => 
                {   console.log(sell_order) ;
                    this.output += "<li>";
                    this.output += cb ( sell_order ) + "</li>";
                } 
            );
            this.output += "</ol>";
        }; // logResult()

       
        
        //    +--> selectSellOrder_subquery_1
        //    |        |   
        //    |        +--> selectSkin()
        //    +--> selectSellOrder_subquery_2
        //             |   
        //             +--> selectSkin()


        const selectSellOrderID_w_where_subquery =  async  ( subquery) => 
        {
            return  await  knex.select('id', 'price', 'market_name', 'skin' ).from('skin_sell_order')
                    .where(  {'item_state' : state, 'has_StatTrak': stattrak } )
                    .where( (builder) => builder.whereIn( 'skin_sell_order.skin', subquery ) ) ;
        }; // selectSellOrderID_w_where_subquery
                    
        const selectSkin_wo_async  =  () => 
        {
            return  knex.select('id').from('skin').where(
                {   
                    'skin_set' : skin_set, 
                    'skin_rarity': rarity++         
                }
            );
        }; // selectSkin_wo_async

        let source_rows = null;
        let target_rows = null;

        selectSellOrder_subquery_1 = await selectSellOrderID_w_where_subquery(  selectSkin_wo_async() )
        .then ( ( rows ) => 
            { 
                logResult (rows, "selectSellOrderID_w_where_subquery 1");
                source_rows = rows;
            } 
        )
        .catch( ( error ) => { konsole.error(  "selectSellOrderID_w_where_subquery 1 "+ error )} );

        selectSellOrder_subquery_2 = await selectSellOrderID_w_where_subquery(  selectSkin_wo_async() )
        .then ( ( rows ) => 
        { 
            logResult (rows, "selectSellOrderID_w_where_subquery 2");
            target_rows = rows;
        } )
        .catch( ( error ) => { konsole.error(  "selectSellOrderID_w_where_subquery 2 "+ error )} );

        konsole.msg( "extractSourceAndTargetRowsFromDB source_rows: " +JSON.stringify(source_rows) );
        konsole.msg( "extractSourceAndTargetRowsFromDB target_rows: " +JSON.stringify(target_rows) );

        return { sources: source_rows, targets: target_rows };
    } // extractSourceAndTargetRowsFromDB


    extractPotentialProfitableTradeUps ( source_rows, target_rows )
    {
      //             target : [ sources ]
      let trade_ups = new Map();
      //                                     10 cheapest
      //  filtered 'trade_ups'    target : [   sources    ]
      let target_to_source_decade = new Map();
      let source_rows_of_target = null;

      target_rows.map
      (
          ( target_row ) =>
          {
              source_rows_of_target = [];
              source_rows.map
              (
                  ( source_row ) =>
                  {
                        if ( ! trade_ups.has ( target_row ) )   trade_ups.set ( target_row, [] );

                        source_rows_of_target = trade_ups.get( target_row );

                        if ( source_rows_of_target.indexOf ( source_row ) == -1 )   source_rows_of_target.push( source_row ); 
                  }
              ); // source_rows.map()

              source_rows_of_target.sort ( this.sortSellOrderByPrice );

              if ( source_rows_of_target.length >= 10)
              {
                  let total_investment = 0.00;

                  for ( let i = 0; i < 10; i++)
                  {
                      let source_row_of_target = source_rows_of_target[1];
                      total_investment += source_row_of_target.price;
                  }
                  if ( total_investment <= target_row.price )
                  {
                      let profit_margin = ( target_row.price - total_investment )/ total_investment * 100.00;
                      console.log ( "C'est bien, rentabilité potentielle :" + profit_margin +' % ' + target_row.market_name );
                      target_to_source_decade.set( target_row, source_rows_of_target.slice( 0, 10 ) ) ;
                      console.log (' --------------------------------------------------- \n' );
                  }
                  else 
                  {
                    target_to_source_decade.set( target_row, [] ) ;
                  }
                      
              }
              else { console.log ('Pas assez de source sellOrder' )}
          }
      ); // target_rows.map

      return target_to_source_decade;
    } // extractPotentialProfitableTradeUps()


    extractSiblingTargetsOfSourceDecade ( ctx, target_rows, target_to_source_decade_arg )
    {
        let sibling_targets_of_source_decade = new Map();
        let trade_up_key = TradeUp.BuildTradeUpKey( ctx );
        sibling_targets_of_source_decade.set ( trade_up_key, new Map() );

        let target_to_source_decade = target_to_source_decade_arg;
        let skin_id_to_siblings = sibling_targets_of_source_decade.get( trade_up_key );

        const storeBySkinId = ( sell_order, skin_id_to_siblings ) =>
        {
            let skin_id = sell_order.skin;
            //if ( skin_id_to_siblings.indexOf( target_row ) == -1 )
            //skin_id_to_siblings.push ( target_row );
            if ( ! skin_id_to_siblings.has( skin_id )  )
                skin_id_to_siblings.set ( skin_id, [] );

            let siblings = skin_id_to_siblings.get ( skin_id );

            if ( siblings.indexOf (sell_order) == -1 )
                siblings.push(sell_order);
            return siblings;
        }; // storeBySkinId

        // 1. extract siblings
        target_rows.map
        (
            ( target_row ) =>
            {
                let siblings = storeBySkinId ( target_row, skin_id_to_siblings );
                let current_source_decade = target_to_source_decade.get ( target_row );

                target_rows.map
                (
                    ( sibling_target_row ) =>
                    {
                        if ( target_row != sibling_target_row )
                        {
                            let sibling_source_decade = target_to_source_decade.get ( sibling_target_row );

                            if ( _.isEqual ( current_source_decade, sibling_source_decade) )
                                storeBySkinId ( sibling_target_row, skin_id_to_siblings );
                        }
                    }
                ); // target_rows.map
            }
        ); // target_rows.map


        // 2. sort siblings
        
        Array.from( skin_id_to_siblings.keys() ).map
        (
            ( skin_id ) =>
            {
                let siblings = skin_id_to_siblings.get ( skin_id );
                siblings.sort ( this.sortSellOrderByPrice );
            }
        )
        // target_rows.map

        return sibling_targets_of_source_decade;

    } // extractSiblingTargetsOfSourceDecade()


    sortSellOrderByPrice( sell_order_1, sell_order_2 )
    {
        if      ( sell_order_1.price > sell_order_2.price ) return  ;
        else if ( sell_order_1.price < sell_order_2.price ) return -1;
        else                                                return 0;
    } // sortSellOrderByPrice


    createTradeUps( ctx, target_to_source_decade_arg, sibling_targets_of_source_decade_arg )
    {
        let trade_up_key = TradeUp.BuildTradeUpKey( ctx );

        Array.from( target_to_source_decade_arg.keys() ).map
        (
            ( target_sell_order ) =>
            {
                konsole.error( "createTradeUps : " + target_sell_order);
                let source_decade               = target_to_source_decade_arg.get( target_sell_order );
                let target_siblings_by_skin_id  = sibling_targets_of_source_decade_arg.get ( trade_up_key );
                
                TradeUp.Create( ctx, source_decade, target_siblings_by_skin_id );
            }
        )
    } // createTradeUps

} // MakeTradeUpsFromDBCmd
exports.MakeTradeUpsFromDBCmd = MakeTradeUpsFromDBCmd;