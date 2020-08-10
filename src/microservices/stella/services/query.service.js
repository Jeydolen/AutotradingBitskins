const assert = require("assert");
const { resolveCname } = require("dns");

const { konsole, LOG_LEVEL } = rekwire ('/src/bb_log.js')
const knex    = rekwire ('/src/bb_database.js').knex_conn;
const TradeUp = rekwire ('/src/model/trade_up.js').TradeUp;
const Session = rekwire ('/src/session.js').Session;
const SkinSellOrder = rekwire ('/src/model/skin_sell_order.js').SkinSellOrder;


module.exports =
{
    name: "query",
    settings:  { routes: [ { path: "/query" } ] },


    actions: 
    { 
        // https://www.searchenginenews.com/sample/content/are-you-using-commas-in-your-urls-heres-what-you-need-to-know
        async select (ctx) 
        {
            //             v    v  v
            // /quety/knex?table=XX&fields=AB,C
            let table  = ctx.params.table != undefined ? ctx.params.table : 'skin_sell_order';
            let fields = ctx.params.fields != undefined ? ctx.params.fields : 'id';
            console.log ( fields )
            let field_items = fields.split('|');
            console.log ( fields )
            let id     = ctx.params.id != undefined ? ctx.params.id : 1;

            let output = [];

            await knex( table ).select( field_items ).where('id', id )
            .then
            (   (rows) =>
                {
                    rows.map
                    ( row => 
                        { 
                            console.log(row) ;
                            output.push(row);  
                        } 
                    );
                }
            );

            ctx.meta.$responseType = "text/json ; charset=utf-8";
            return JSON.stringify ( output ); // knex select
            
        }, // 'select' action



        async profit (ctx)
        {
            let skin_set    = ctx.params.skinset    != undefined ? ctx.params.skinset   : 5;
            let rarity      = ctx.params.rarity     != undefined ? ctx.params.rarity    : 4;
            let state       = ctx.params.state      != undefined ? ctx.params.state     : 4;
            let stattrak    = ctx.params.stattrak   != undefined ? ctx.params.stattrak  : 1;

            let output = "<html><body><ol>";

            const logResult = (rows) =>
            {
                {
                    console.log (rows)
                    rows.map
                    ( row => 
                        {   console.log(row) ;

                            
                            output += "<li>";

                            output +=   row.SQ1_id + "==>" + row.SQ2_id + "</li>";
                        } 
                    );
                }
               
            }; // logResult()

            
            const  selectTradeUp =   async (subquery_1, subquery_2) =>
            {
                return  await knex.select().from  (subquery_1)
                            .innerJoin      ((subquery_2 ), knex.raw('(SQ1_price * 7.50) < (SQ2_price * 1.00)'));
            }; // selectTradeUp()


            const selectSellOrderID =  async  (subquery, tmp_table) => 
            {
                return  await  knex.select('id as ' + tmp_table + '_id', 'price as ' + tmp_table + '_price').from('skin_sell_order')
                     .where(  {'item_state' : state, 'has_StatTrak': stattrak } )
                     .where( (builder) => builder.whereIn( 'skin_sell_order.skin', subquery ) ).as( tmp_table ) ;
            }; // selectSellOrderID


            //                  vvvvv
            const selectSkin  =  async () => 
            {
                //             vvvvv
                return query =  await knex.select('id').from('skin').where(
                    {   
                        'skin_set' : skin_set, 
                        'skin_rarity': rarity++         
                    }
                );
            }; // selectSkin


            const fillOutputMsg = async ( ) =>
            {
                await TradeUp.Instances.forEach(   
                async ( trade_up_obj, trade_up_key, map ) =>
                    {
                        console.log( trade_up_key );
                        msg = JSON.stringify( trade_up_obj.toJSON() )
                        let rarity = trade_up_obj.getSourceRarity();

                        let target_map  = TradeUp.Rarity2TargetIdToSourceIds.get( rarity );
                        assert( target_map != undefined, "target map undefined");

                        let target_id_2_source_ids = target_map.get( trade_up_obj.getTargetId() );
                        assert( target_id_2_source_ids != undefined, "target_id_2_source_ids undefined");

                        source_ids = target_id_2_source_ids.getSourceIds();

                        await source_ids.forEach( 
                            async ( source_id ) =>
                            {
                                let source_sell_order_obj = await SkinSellOrder.GetFromRecordId( source_id, SkinSellOrder );
                                assert( source_sell_order_obj != null  &&  source_sell_order_obj != undefined );
                                let price = source_sell_order_obj.price;
                                console.log ( 'price : ' + price )
                                prices.push( price );
                            }
                        ); // forEech( source_ids )

                        output += "</ul></li>";
           
                        output += "<li>" + msg
                                     + "<br>&nbsp;&nbsp;-->&nbsp;&nbsp;" + source_ids 
                                     + "<br>&nbsp;&nbsp;-->&nbsp;&nbsp; Prices " + prices 
                                     + "</li>";
                    } 
                ); // TradeUp.Instances.forEach
            }; // fillOutputMsg
       

            //--------------------------------------------------------
            let selectSkin_subquery_1       =   null;// selectSkin();
            let selectSkin_subquery_2       =   null;// selectSkin();
            /*
            let selectSellOrder_subquery_1  = selectSellOrder_old( selectSkin_subquery_1, 'SQ1'  );
            let selectSellOrder_subquery_2  = selectSellOrder_old( selectSkin_subquery_2, 'SQ2'  );
            */
            let selectSellOrder_subquery_1  =   null; // selectSellOrderID( selectSkin_subquery_1, 'SQ1'  );
            let selectSellOrder_subquery_2  =   null; // selectSellOrderID( selectSkin_subquery_2, 'SQ2'  );
            
            /*
            await selectTradeUp( selectSellOrder_subquery_1, selectSellOrder_subquery_2)
            .then( async (rows) => 
            {
                rows.map
                ( async (row) => 
                    {   
                        //let trade_up_obj = new TradeUp( row );
                        let trade_up_obj = TradeUp.Create( row, rarity );
                        await trade_up_obj.init();
                    } 
                );
            });
            */

           let prices = [];
           let source_ids = []; 
           let msg        = null; 

           let selectSellOrder_subquery = null;

           const  getMoulaga =    (subquery_1, subquery_2 ) =>
           {
               return  knex.select().from  (subquery_1)
                           .innerJoin      ((subquery_2 ), knex.raw('(SQ1_price * 7.50) < (SQ2_price * 1.00)'));
           }; // getMoulaga()

           // getMoulaga
           //    |
           //    +--> selectSellOrder_subquery_1
           //    |        |   
           //    |        +--> selectSkin_subquery_1
           //    |                 |
           //    |                 +--> selectSkin
           //    |
           //    +--> selectSellOrder_subquery_2
           //             |   
           //             +--> selectSkin_subquery_2
           //                      |
           //                      +--> selectSkin
           selectSkin_subquery_1 = await selectSkin()
           .then( async () =>
             {
                selectSellOrder_subquery_1 = await selectSellOrderID( selectSkin_subquery_1, 'SQ1'  );
                return selectSellOrder_subquery_1;
             }
           )
           .then ( (rows ) => logResult (rows) );
           /*
           .then( async () =>
             {
                selectSkin_subquery_2 = await selectSkin(); // rarity + 1
                return selectSkin_subquery_2;
             }
           )
           .then( async () =>
             {
                selectSellOrder_subquery_2 = await selectSellOrderID( selectSkin_subquery_2, 'SQ2'  );
                return selectSellOrder_subquery_2;
             }
           )
           .then( async () =>
             {
                return await getMoulaga( selectSellOrder_subquery_1, selectSellOrder_subquery_2 );
             }
           )
           .then( (rows) => 
           {
               rows.map
               ( async (row) => 
                   {   
                       //let trade_up_obj = new TradeUp( row );
                       let trade_up_obj = TradeUp.Create( row, rarity );
                       await trade_up_obj.init();
                   } 
               );
               //return new Promise( fillOutputMsg );
           })
           .then( async () =>
            {
                await fillOutputMsg();
            }
           );
           */

           


            /*
            await TradeUp.Instances.forEach( 
                async (trade_up_obj, trade_up_key, map) =>
                {
                    console.log( trade_up_key );
                    let msg         = JSON.stringify( trade_up_obj.toJSON() )
                    let rarity      = trade_up_obj.getSourceRarity();

                    let target_map  = TradeUp.Rarity2TargetIdToSourceIds.get( rarity );
                    assert( target_map != undefined, "target map undefined");

                    let target_id_2_source_ids = target_map.get( trade_up_obj.getTargetId() );
                    assert( target_id_2_source_ids != undefined, "target_id_2_source_ids undefined");

                    let source_ids = target_id_2_source_ids.getSourceIds();

                    //output += "<li><ui>";

                    let prices = []; 
                    await source_ids.forEach( async (source_id) =>
                        {
                            let source_sell_order_obj = await SkinSellOrder.GetFromRecordId( source_id, SkinSellOrder );
                            assert( source_sell_order_obj != null  &&  source_sell_order_obj != undefined );
                            //konsole.log ( 'Sell_order_obj : ' + JSON.stringify(source_sell_order_obj) , LOG_LEVEL.MSG)
                            //assert ( source_sell_order_obj != SkinSellOrder.NULL )
                            //let price = source_sell_order_obj.getPrice();
                            let price = source_sell_order_obj.price;
                            console.log ( 'price : ' + price )
                            prices.push( price );
                        }
                    )
                    

                }
                output += "</ul></li>";
           
            output += "<li>" + msg
                        + "<br>&nbsp;&nbsp;-->&nbsp;&nbsp;" + source_ids 
                        + "<br>&nbsp;&nbsp;-->&nbsp;&nbsp;" + prices 
                        + "</li>";
            );
            */



            // https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types
            ctx.meta.$responseType = "text/html ; charset=utf-8";
        
            output += "</ol></body></html>";
            return output;
        }, // 'profit' action



        async profit_1 (ctx)
        {
            let skin_set    = ctx.params.skinset    != undefined ? ctx.params.skinset   : 4;
            let rarity      = ctx.params.rarity     != undefined ? ctx.params.rarity    : 4;
            let state       = ctx.params.state      != undefined ? ctx.params.state     : 1;
            let stattrak    = ctx.params.stattrak   != undefined ? ctx.params.stattrak  : 0;

            let output = "";
            let store_rows = '';

            const logResult = (rows) =>
            {
               rows.map
                    ( row => 
                        { console.log(row) ;
                        output += "<li>" + JSON.stringify(row) + "</li>";  
                        } 
                    );
            }; // logResult()


            const selectSellOrder = (subquery) => 
            {
                return  knex.select('name', 'price', 'skin', 'market_name').from('skin_sell_order')
                     .where( (builder) => builder.whereIn( 'skin_sell_order.skin', subquery ) )
            }; // selectSellOrder

            let query = null;

            const selectSkin  = () => 
            {
                return query = knex.select('id').from('skin').where(
                    {   'skin_set' : skin_set, 
                        'skin_rarity': rarity++,
                        //'item_state': state,
                        //'has_StatTrak': stattrak             
                    }
                );
            }; // selectSkin
       
            output = '<p>selectSkin: ' + rarity + '</p>';
            //await selectSkin().then( (rows) => logResult(rows) );

            await selectSkin().then(
                                (rows) =>
                                    {
                                        rows.map
                                        ( row => 
                                            { console.log(row) ;
                                            output += "<p>" + JSON.stringify(row) + "</p>";  
                                            } 
                                        );
                                    }
            );

            output += '<br><p>selectSkin +1: ' + rarity + '</p>';
            let subquery = selectSkin();
            

            output += '<br><p>selectSellOrder</p>';
            await selectSellOrder(subquery).then( (rows) => logResult(rows) );

            // https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types
            ctx.meta.$responseType = "text/html ; charset=utf-8";

            return output;
        } // 'profit_1' action

    } // query service actions
};