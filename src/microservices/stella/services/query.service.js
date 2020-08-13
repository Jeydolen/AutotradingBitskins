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


            const defaultExtractSellOrderAttribute_CB = ( sell_order, attribute_name = 'id' ) => { return sell_order[attribute_name]; };

            const logResult = ( sell_orders, msg, cb = defaultExtractSellOrderAttribute_CB ) =>
            {
                    console.log ( sell_orders )
                    output += "<p>" + msg + "</p><ol>";
                    sell_orders.map
                    ( sell_order => 
                        {   console.log(sell_order) ;
                            output += "<li>";
                            output += cb ( sell_order ) + "</li>";
                        } 
                    );
                    output += "</ol>";
            }; // logResult()

            

            
            const  selectTradeUp =   async (subquery_1, subquery_2) =>
            {
                return  await knex.select().from  (subquery_1)
                            .innerJoin      ((subquery_2 ), knex.raw('(SQ1_price * 7.50) < (SQ2_price * 1.00)'));
            }; // selectTradeUp()


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

           let output = "<html><body><p>Results:</p><ol>";
           let prices       = []; 
           let msg          = null; 

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

           const selectSellOrderID =  async  ( subquery, tmp_table) => 
           {
               return  await  knex.select('id as ' + tmp_table + '_id', 'price as ' + tmp_table + '_price').from('skin_sell_order')
                    .where(  {'item_state' : state, 'has_StatTrak': stattrak } )
                    .where( (builder) => builder.whereIn( 'skin_sell_order.skin', subquery ) ).as( tmp_table ) ;
           }; // selectSellOrderID


           const selectSellOrderID_wo_where =  async  ( subquery, tmp_table) => 
           {
               return  await  knex.select('id as ' + tmp_table + '_id', 'price as ' + tmp_table + '_price').from('skin_sell_order');
           }; // selectSellOrderID_wo_where


           const selectSellOrderID_w_1st_where =  async  ( subquery, tmp_table) => 
           {
               return  await    knex.select('id as ' + tmp_table + '_id', 'price as ' + tmp_table + '_price').from('skin_sell_order')
                                .where(  {'item_state' : state, 'has_StatTrak': stattrak } );
           }; // selectSellOrderID_w_1st_where


           const selectSellOrderID_w_where_subquery =  async  ( subquery) => 
           {
               return  await  knex.select('id', 'price', 'market_name' ).from('skin_sell_order')
                    .where(  {'item_state' : state, 'has_StatTrak': stattrak } )
                    .where( (builder) => builder.whereIn( 'skin_sell_order.skin', subquery ) ) ;
           }; // selectSellOrderID_w_where_subquery

           const selectSellOrderID_w_where_subquery_wo_async =   ( subquery, tmp_table) => 
           {
               return   knex.select('id as ' + tmp_table + '_id', 'price as ' + tmp_table + '_price').from('skin_sell_order')
                    .where(  {'item_state' : state, 'has_StatTrak': stattrak } )
                    .where( (builder) => builder.whereIn( 'skin_sell_order.skin', subquery ) ).as( tmp_table ) ;
           }; // selectSellOrderID_w_where_subquery



            //================ OK 1 ===============
            const selectSkin  =  async () => 
            {
                return query =  await knex.select('id').from('skin').where(
                    {   
                        'skin_set' : skin_set, 
                        'skin_rarity': rarity++         
                    }
                );
            }; // selectSkin

            
            const selectSkin_wo_async  =  () => 
            {
                return query =  knex.select('id').from('skin').where(
                    {   
                        'skin_set' : skin_set, 
                        'skin_rarity': rarity++         
                    }
                );
            }; // selectSkin_wo_async

            /*
            let selectSkin_result = await selectSkin()
            .then ( ( rows ) => { logResult (rows, "selectSkin() 1er then") ; return rows; }  )  
            .then ( ( rows ) => { logResult (rows, "selectSkin() 2e then") } ); 
            */
            //================ OK 1 ================          


            //================ OK 2 ==============
            /*
            let mkSelectSkinPromise = async () =>
            {
                await selectSkin()
                .then ( ( rows ) => { logResult (rows, "selectSkin() 1er then") ; return rows; }  )  
                .then ( ( rows ) => { logResult (rows, "selectSkin() 2e then") } );
            };

            let selectSkin_result_test = await mkSelectSkinPromise();
            */
            //================ OK 2 ==============


            //================ OK 3 ==============
            let mkSelectSkinPromise_wo_log = async () =>
            {
                return await selectSkin();
                //.then ( ( rows ) => { logResult (rows, "selectSkin() -- 1er then") ; return rows; }  )  
                //.then ( ( rows ) => { logResult (rows, "selectSkin() -- 2e then") } );
            }; // mkSelectSkinPromise_wo_log

            let mkSelectSkinPromise = async () =>
            {
                return await selectSkin()
                .then ( ( rows ) => { logResult (rows, "selectSkin() -- 1er then") ; return rows; }  )  
                .then ( ( rows ) => { logResult (rows, "selectSkin() -- 2e then") } );
            };

            //let selectSkin_result_test = await mkSelectSkinPromise();
            //================ OK 3  ==============

            //================ TEST 0 ================
            // Alexandre connait le type "String" et "Char"
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

            let potential_profitable_trade_ups = TradeUp.ExtractPotentialProfitableTradeUps ( target_rows, source_rows );


            //konsole.msg( JSON.stringify(Array.from(trade_ups.keys())), LOG_LEVEL.INFO );
            //================ TEST 0 ==========

            /*
            await 
            .Instances.forEach( 
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
        } // 'profit' action

    } // query service actions
};