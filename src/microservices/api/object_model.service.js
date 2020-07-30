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
            var ids = [];
            
            var id_ctx  = ctx.params.id != undefined ?  ctx.params.id : 1;
            if ( id_ctx.search ('|') != -1 )
                ids = id_ctx.split('|');
            else
                ids.push (id) ;
            console.log ('id : ' +  typeof ids )

            var bb_objects = [];
            console.log (ids)
            for ( var i=0; i < ids.length; i++ )
            {
                var id = Number(ids[i]);
                console.log ('for typeof id :' + typeof id + ' id : ' + id)
                var bb_obj = SkinSellOrder.GetFromRecordId( id );

                if ( bb_obj !== SkinSellOrder.NULL )
                    bb_objects.push(bb_obj); // Obj deja trouvé
                    
                else
                {
                    // Restauration depuis db (deserialization)
                    var result_rows = await SkinSellOrder.LoadFromDBTable( id );
                    var rows_count = result_rows.length;
                    console.log( "rows_count: " + rows_count + ' result_rows :' + result_rows);
        
                    if ( rows_count == 1 )
                    {
                        var row = result_rows[ 0 ];
                        console.log( "row " + JSON.stringify(row))
                        bb_obj = await SkinSellOrder.Create(  row,  Konst.Reason.Deserialize );
                        bb_objects.push( bb_obj );
                    }
                    else console.log ('JE SUIS M2CHANT' + rows_count)
                }
            }

            ctx.meta.$responseType = "text/json ; charset=utf-8";
            //console.log ( JSON.stringify ( bb_objects ) )
            return bb_objects;          
            //return "Error /stella/skin_sell_order/list";// + rows_count;  
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