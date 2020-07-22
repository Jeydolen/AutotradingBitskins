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
        ]
    },
    actions: 
    { 
        knex ( ctx ) 
        {
            //             v    v  v
            // /quety/knex?table=XX&fields=A,B,C
            var table  = ctx.params.table != undefined ? ctx.params.table : 'skin_sell_order';
            var fields = ctx.params.fields != undefined ? ctx.params.fields : 'id';
            var field_items = fields.split(fields, ',');
            var id     = ctx.params.id != undefined ? ctx.params.id : 0;

            knex( table ).select( field_items ).where('id', id )
            .then
            ( rows =>
                rows.map
                ( row => { console.log(row) } )
            ) // knex select

        } // submit action
    } // query service actions
};