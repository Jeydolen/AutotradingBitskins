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

            const logResult = (rows, msg, attribute_name) =>
            {
                    console.log (rows)
                    output += "<p>" + msg + "</p><ol>";
                    rows.map
                    ( row => 
                        {   console.log(row) ;
                            output += "<li>";
                            output += row[attribute_name] + "</li>";
                            //output += JSON.stringify(row) + "-- '" + attribute_name + "'</li>";
                            //output +=   row.SQ1_id + "==>" + row.SQ2_id + "</li>";
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


           const selectSellOrderID_w_where_subquery =  async  ( subquery, tmp_table) => 
           {
               return  await  knex.select('id as ' + tmp_table + '_id', 'price as ' + tmp_table + '_price').from('skin_sell_order')
                    .where(  {'item_state' : state, 'has_StatTrak': stattrak } )
                    .where( (builder) => builder.whereIn( 'skin_sell_order.skin', subquery ) ).as( tmp_table ) ;
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
                //.then ( ( rows ) => { logResult (rows, "selectSkin() -- 1er then", "id") ; return rows; }  )  
                //.then ( ( rows ) => { logResult (rows, "selectSkin() -- 2e then", "id") } );
            }; // mkSelectSkinPromise_wo_log

            let mkSelectSkinPromise = async () =>
            {
                return await selectSkin()
                .then ( ( rows ) => { logResult (rows, "selectSkin() -- 1er then", "id") ; return rows; }  )  
                .then ( ( rows ) => { logResult (rows, "selectSkin() -- 2e then", "id") } );
            };

            //let selectSkin_result_test = await mkSelectSkinPromise();
            //================ OK 3  ==============


            //================ OK 4 ==============
            //await selectSellOrderID_wo_where( await mkSelectSkinPromise(), 'SQ1' ) 
            //.then ( ( rows ) => { logResult (rows, "selectSellOrderID_wo_where", "SQ1_id") } ); 
            //================ OK 4 ==============


            //================ OK 5 ==============
            //await selectSellOrderID_w_1st_where( await mkSelectSkinPromise(), 'SQ1' )  OK 
            //await selectSellOrderID_w_1st_where( selectSkin_wo_async(), 'SQ1' )          // OK aussi !!
            //.then ( ( rows ) => { logResult (rows, "selectSellOrderID_w_1st_where", "SQ1_id") } ); 
            //================ OK 5 ==============


            //================ OK 6 ================
            //await selectSellOrderID_w_where_subquery(  selectSkin_wo_async(), 'SQ1' ) 
            //.then ( ( rows ) => { logResult (rows, "selectSellOrderID_w_where_subquery", "SQ1_id") } ); 
            //================ OK 6 ================


            //================ TEST 0 ================
            // Alexandre connait le type "String" et "Char"
            let source_rows = null;
            let target_rows = null;

            selectSellOrder_subquery_1 = await selectSellOrderID_w_where_subquery(  selectSkin_wo_async(), 'SQ1' )
            .then ( ( rows ) => 
                { 
                    logResult (rows, "selectSellOrderID_w_where_subquery 1", "SQ1_id");
                    source_rows = rows;
                } 
            )
            .catch( ( error ) => { konsole.error(  "selectSellOrderID_w_where_subquery 1 "+ error )} );

            selectSellOrder_subquery_2 = await selectSellOrderID_w_where_subquery(  selectSkin_wo_async(), 'SQ2' )
            .then ( ( rows ) => 
            { 
                logResult (rows, "selectSellOrderID_w_where_subquery 1", "SQ2_id");
                target_rows = rows;
            } )
            .catch( ( error ) => { konsole.error(  "selectSellOrderID_w_where_subquery 2 "+ error )} );

            konsole.msg( JSON.stringify(source_rows) );
            konsole.msg( JSON.stringify(target_rows) );

            let trade_up_profit_ratio = 10.0;
            let trade_ups = new Map();

            const sortSourcesByPrice = ( source_1, source_2 ) =>
            {
                if      ( source_1.SQ1_price > source_2.SQ1_price ) return  ;
                else if ( source_1.SQ1_price < source_2.SQ1_price ) return -1;
                else                                                return 0;
            }; // sortSourcesByPrice
 
            let source_ids  = null;

            target_rows.map
            (
                ( target ) =>
                {
                    source_rows.map
                    (
                        ( source ) =>
                        {
                            if ( source.SQ1_price * trade_up_profit_ratio <= target.SQ2_price  )
                            {
                                konsole.warn( source.SQ1_id + " (" + source.SQ1_price + ")  =>  " + target.SQ2_id + " (" + target.SQ2_price + ")");

                                if ( ! trade_ups.has( target.SQ2_id ) )
                                {
                                    // konsole.log(" adding id: " + target.SQ2_id );
                                    trade_ups.set( target.SQ2_id, [] );
                                }

                                source_ids = trade_ups.get( target.SQ2_id );

                                if ( source_ids.indexOf( source.SQ1_id ) == -1 )
                                    source_ids.push( source.SQ1_id );
                            }
                        }
                    ); // source_rows.map()

                    source_ids = trade_ups.get( target.SQ2_id );

                    source_ids.map
                    (
                        (source) =>
                        { 
                            konsole.log( "id: " + source.SQ2_id + " price: " + source.SQ1_price );
                        }
                    )
                    //source_ids.sort( () );
                }
            ); // target_rows.map

            konsole.msg( JSON.stringify(Array.from(trade_ups.keys())), LOG_LEVEL.INFO );
            //================ TEST 0 ==========


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