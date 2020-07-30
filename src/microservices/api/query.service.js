const knex    = rekwire ('/src/bb_database.js').knex_conn;
const Session = rekwire ('/src/session.js').Session;


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
            var table  = ctx.params.table != undefined ? ctx.params.table : 'skin_sell_order';
            var fields = ctx.params.fields != undefined ? ctx.params.fields : 'id';
            console.log ( fields )
            var field_items = fields.split('|');
            console.log ( fields )
            var id     = ctx.params.id != undefined ? ctx.params.id : 1;

            var output = [];

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
            var skin_set    = ctx.params.skinset    != undefined ? ctx.params.skinset   : 5;
            var rarity      = ctx.params.rarity     != undefined ? ctx.params.rarity    : 4;
            var state       = ctx.params.state      != undefined ? ctx.params.state     : 4;
            var stattrak    = ctx.params.stattrak   != undefined ? ctx.params.stattrak  : 1;

            var output = "<ol>";

            const logResult = (rows) =>
            {
               rows.map
                    ( row => 
                        {   console.log(row) ;

                            output += "<li>" + row.SQ1_market_name;

                            output +=   row.SQ1_market_name + "@" + row.SQ1_price.toFixed(2) + "€&nbsp;&nbsp;<br>" 
                                        + "==>" + row.SQ2_market_name +"@" + row.SQ2_price.toFixed(2) + "€&nbsp;&nbsp;";

                            var virtual_profit = (row.SQ2_price - (row.SQ1_price * 10)).toFixed(2) + "€" ;
                            output += "&nbsp; Profit : " + virtual_profit + "</li>";
                        } 
                    );
            }; // logResult()

            
            const selectTradeUp = (subquery_1, subquery_2) =>
            {
                return  knex.select().from  (subquery_1)
                            .innerJoin      (subquery_2 , knex.raw('(SQ1_price * 10.00) < (SQ2_price * 1.00)'));
            }; // selectTradeUp()


            const selectSellOrder = (subquery, tmp_table) => 
            {
                return  knex.select('name as ' + tmp_table +'_name', 'price as ' + tmp_table +'_price', 'skin', 'market_name as ' + tmp_table +'_market_name').from('skin_sell_order')
                     .where(  {'item_state' : state, 'has_StatTrak': stattrak } )
                     .where( (builder) => builder.whereIn( 'skin_sell_order.skin', subquery ) ).as( tmp_table ) ;
            }; // selectSellOrder


            const selectSkin  = () => 
            {
                return query = knex.select('id').from('skin').where(
                    {   
                        'skin_set' : skin_set, 
                        'skin_rarity': rarity++         
                    }
                );
            }; // selectSkin
       
            //--------------------------------------------------------
            //await selectSkin().then( (rows) => logResult(rows) );
            
            //await selectSellOrder(selectSkin_subquery).then( (rows) => logResult(rows) );

            var selectSkin_subquery_1       = selectSkin();
            var selectSkin_subquery_2       = selectSkin();
            var selectSellOrder_subquery_1  = selectSellOrder( selectSkin_subquery_1, 'SQ1'  );
            var selectSellOrder_subquery_2  = selectSellOrder( selectSkin_subquery_2, 'SQ2'  );

            await selectTradeUp(selectSellOrder_subquery_1, selectSellOrder_subquery_2).then( (rows) => logResult(rows) );


            // https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types
            ctx.meta.$responseType = "text/html ; charset=utf-8";

            output += "</ol>";
            return output;
        }, // 'profit' action



        async profit_1 (ctx)
        {
            var skin_set    = ctx.params.skinset    != undefined ? ctx.params.skinset   : 4;
            var rarity      = ctx.params.rarity     != undefined ? ctx.params.rarity    : 4;
            var state       = ctx.params.state      != undefined ? ctx.params.state     : 1;
            var stattrak    = ctx.params.stattrak   != undefined ? ctx.params.stattrak  : 0;

            var output = "";
            var store_rows = '';

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

            var query = null;

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
            var subquery = selectSkin();
            

            output += '<br><p>selectSellOrder</p>';
            await selectSellOrder(subquery).then( (rows) => logResult(rows) );

            // https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types
            ctx.meta.$responseType = "text/html ; charset=utf-8";

            return output;
        } // 'profit_1' action

    } // query service actions
};