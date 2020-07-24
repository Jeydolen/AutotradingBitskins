const Session = rekwire ('/src/session.js').Session;


const KNEX_ADMIN  = 'KnexAdmin';
const KNEX_PWD    = '6ZuwI9Lc20YWMb*70JQ^s^nV^';

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host      :     'localhost',
        port      :     3308,
        charset   :     'utf8',
        user      :     KNEX_ADMIN,
        password  :     KNEX_PWD,
        database  :     Session.GetSingleton().getAppVar(Session.DB_Name)
    }
  });

module.exports =
{
    name: "query",
    settings: 
    {
        routes: 
        [
            { path: "/query" }
        ],
        responseFormatter: "raw"
    },
    actions: 
    { 
        select (ctx) 
        {
            //             v    v  v
            // /quety/knex?table=XX&fields=A,B,C
            var table  = ctx.params.table != undefined ? ctx.params.table : 'skin_sell_order';
            var fields = ctx.params.fields != undefined ? ctx.params.fields : 'id';
            var field_items = fields.split(',');
            var id     = ctx.params.id != undefined ? ctx.params.id : 0;

            var output = "";

            knex( table ).select( field_items ).where('id', id )
            .then
            (   (rows) =>
                {
                    rows.map
                    ( row => 
                        { console.log(row) ;
                          output += row + "\n";  
                        } 
                    );
                    return "/query/select: "+ output;
                }
            ); // knex select
        }, // 'select' action

        async profit (ctx)
        {
            var skin_set    = ctx.params.skinset    != undefined ? ctx.params.skinset   : 4;
            var rarity      = ctx.params.rarity     != undefined ? ctx.params.rarity    : 4;
            var state       = ctx.params.state      != undefined ? ctx.params.state     : 1;
            var stattrak    = ctx.params.stattrak   != undefined ? ctx.params.stattrak  : 0;

            const selectSkin = knex.select('id').from('skin').where(
                    {   'skin_set' : skin_set, 
                        'skin_rarity': rarity,
                        //'item_state': state,
                        //'has_StatTrak': stattrak
                    });
        
            var output = "";

            await selectSkin
            .then(   (rows) =>
                {
                    rows.map
                    ( row => 
                        { console.log(row) ;
                        output += "<p>" + JSON.stringify(row) + "</p>";  
                        } 
                    );
                }
            ); // knex select

            // https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types
            ctx.meta.$responseType = "text/html ; charset=utf-8";

            return output;
        } // 'profit' action

    } // query service actions
};