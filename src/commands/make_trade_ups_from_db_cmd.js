const knex                   = rekwire ('/src/bb_database.js').knex_conn;
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
    }

    extractPotentialProfitableTradeUps ( target_rows, source_rows)
    {
      //              target : [ sources ]
      let trade_ups = new Map();

      //                                     10 cheapest
      //  filtered 'trade_ups'    target : [   sources    ]
      let potential_profitable_trade_ups = new Map();
      let sources = null;

      target_rows.map
      (
          ( target ) =>
          {
              sources = [];
              source_rows.map
              (
                  ( source ) =>
                  {
                      //if ( source.price * trade_up_profit_ratio <= target.price  )
                      {
                          //konsole.warn( source.id + " (" + source.price + ")  =>  " + target.id + " (" + target.price + ")");

                          if ( ! trade_ups.has( target.id ) )
                          {
                              // konsole.log(" adding id: " + target.SQ2_id );
                              trade_ups.set( target.id, [] );
                          }

                          let source_ids = trade_ups.get( target.id );

                          if ( source_ids.indexOf( source.id ) == -1 )
                          {
                              source_ids.push( source.id );
                              sources.push( source );
                          }
                      }
                  }
              ); // source_rows.map()

              sources.sort ( this.sortSellOrderByPrice );

              if ( sources.length >= 10)
              {
                  let total_investment = 0.00;

                  for ( let i = 0; i < 10; i++)
                  {
                      let source = sources[1];
                      total_investment += source.price;
                  }
                  if ( total_investment <= target.price )
                  {
                      let profit_margin = ( target.price - total_investment )/ total_investment * 100.00;
                      console.log ( "C'est bien, rentabilité potentielle :" + profit_margin +' % ' + target.market_name );
                      potential_profitable_trade_ups.set( target, sources.slice( 0, 10 ) ) ;
                      console.log (' --------------------------------------------------- \n' );
                  }
                  else 
                  {
                      potential_profitable_trade_ups.set( target, [] ) ;
                  }
                      
              }
              else { console.log ('Pas assez de source sellOrder' )}
          }
      ); // target_rows.map

      return potential_profitable_trade_ups;
    } // extractPotentialProfitableTradeUps()


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
            return  await  knex.select('id', 'price', 'market_name' ).from('skin_sell_order')
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

        konsole.msg( JSON.stringify(source_rows) );
        konsole.msg( JSON.stringify(target_rows) );

        return { sources: source_rows, targets: target_rows };
    } // extractSourceAndTargetRowsFromDB


    sortSellOrderByPrice( sell_order_1, sell_order_2 )
    {
        if      ( sell_order_1.price > sell_order_2.price ) return  ;
        else if ( sell_order_1.price < sell_order_2.price ) return -1;
        else                                                return 0;
    } // sortSellOrderByPrice


    createTradeUps(ctx, potential_profitable_trade_ups_arg )
    {
        Array.from( potential_profitable_trade_ups_arg.keys() ).map
        (
            ( target_sell_order ) =>
            {
                let source_sell_orders = potential_profitable_trade_ups_arg.get( target_sell_order );
                TradeUp.Create( ctx, target_sell_order, source_sell_orders );
            }
        )
    } // createTradeUps


    async execute ( ctx )
    {
        let source_and_target_rows= await this.extractSourceAndTargetRowsFromDB( ctx );

        let source_rows = source_and_target_rows.sources;
        let target_rows = source_and_target_rows.targets;

        let potential_profitable_trade_ups = this.extractPotentialProfitableTradeUps ( target_rows, source_rows );

        this.createTradeUps(ctx, potential_profitable_trade_ups );

        return  this.output;
    } // execute()

} // MakeTradeUpsFromDBCmd
exports.MakeTradeUpsFromDBCmd = MakeTradeUpsFromDBCmd;