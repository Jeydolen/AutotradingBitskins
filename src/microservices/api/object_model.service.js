const { dialog }    = require( 'electron' );
const APP_ROOT_PATH = require ('app-root-path');

const Session               = rekwire ('/src/session.js').Session;
const PopulateDBCmd         = rekwire ('/src/commands/populate_db_cmd.js').PopulateDBCmd;
const BackupDBCmd           = rekwire ('/src/commands/backup_db_cmd.js').BackupDBCmd;
const RestoreDBCmd          = rekwire ('/src/commands/restore_db_cmd.js').RestoreDBCmd;
const ProfitSelectSkinCmd   = rekwire ('/src/commands/profit_select_skin_cmd.js').ProfitSelectSkinCmd;
const { SkinSellOrder  }    = rekwire ('/src/model/skin_sell_order.js') ;
const Konst                 = rekwire ('/src/constants.js');

// https://github.com/moleculerjs/moleculer-web/blob/master/examples/rest/index.js
module.exports =
{
    name: "skin_sell_order",
    settings: 
    {
        routes: 
        [
            { path: "/skin_sell_order" }
        ]
    },
    actions: 
    { 
        async list ( ctx )
        {
            var id = ctx.params.id != undefined ?  ctx.params.id : 1;

            var result_rows = await SkinSellOrder.LoadFromDBTable( { 'id': id } );
            //console.log( "result_rows : " +  JSON.stringify( result_rows ) );

            var rows_count = result_rows.length;
            //console.log( "rows_count: " + rows_count );

            if ( rows_count == 1 )
            {
                var row = result_rows[ 0 ];
                console.log( "row " + JSON.stringify(row))
                var bb_obj = await SkinSellOrder.Create(  row,  Konst.Reason.Deserialize );

                ctx.meta.$responseType = "text/json ; charset=utf-8";
                return JSON.stringify( bb_obj );            
            }
            else
                return "Error /stella/db/skin_sell_order: rows_count = ";// + rows_count;  
        }, // list


        async update ( ctx )
        {
        }, // update

        async save ( ctx )
        {
            var id = ctx.params.id != undefined ?  ctx.params.id : 1;


            ctx.meta.$responseType = "text/json ; charset=utf-8";            
            return "Error /stella/skin_sell_order/save id= " + id;// + rows_count;  
        } // save

    } // actions list
}; // 'skin_sell_order' service