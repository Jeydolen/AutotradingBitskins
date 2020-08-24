
const { MakeTradeUpsFromDBCmd } = rekwire("/src/commands/make_trade_ups_from_db_cmd.js");
const { mapToString } = rekwire ('/src/utility.js')


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
            //console.log ( fields )
            let field_items = fields.split('|');
            //console.log ( fields )
            let id     = ctx.params.id != undefined ? ctx.params.id : 1;

            let output = [];

            await knex( table ).select( field_items ).where('id', id )
            .then
            (   (rows) =>
                {
                    rows.map
                    ( row => 
                        { 
                            //console.log(row) ;
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
            // https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types
            //ctx.meta.$responseType = "text/html ; charset=utf-8";
            let output = await MakeTradeUpsFromDBCmd.GetSingleton().execute( ctx );
            //output += "</ol></body></html>";
            
            ctx.meta.$responseType = "text/plain ; charset=utf-8";
            return output;
        } // 'profit' action

    } // query service actions
}; // "query" service