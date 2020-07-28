const { dialog }    = require( 'electron' );
const APP_ROOT_PATH = require ('app-root-path');

const Session               = rekwire ('/src/session.js').Session;
const PopulateDBCmd         = rekwire ('/src/commands/populate_db_cmd.js').PopulateDBCmd;
const BackupDBCmd           = rekwire ('/src/commands/backup_db_cmd.js').BackupDBCmd;
const RestoreDBCmd          = rekwire ('/src/commands/restore_db_cmd.js').RestoreDBCmd;
const ProfitSelectSkinCmd   = rekwire ('/src/commands/profit_select_skin_cmd.js').ProfitSelectSkinCmd;
const { SkinSellOrder  }    = rekwire ('/src/model/skin_sell_order.js') ;
const Konst                 = rekwire ('/src/constants.js');


module.exports =
{
    name: "db",
    settings: 
    {
        routes: 
        [
            { path: "/db" }
        ]
    },
    actions: 
    { 
        async skin_sell_order ( ctx )
        {
            var id = ctx.params.id != undefined ?  ctx.params.id : 1;

            var result_rows = await SkinSellOrder.LoadFromDBTable( { 'id': id } );
            console.log( "result_rows : " +  JSON.stringify( result_rows ) );

            var rows_count = result_rows.length;
            console.log( "rows_count: " + rows_count );

            if ( rows_count == 1 )
            {
                var row = result_rows[ 0 ];
                var bb_obj = SkinSellOrder.Create(  row,  Konst.Reason.Deserialize );
                //console.log( "row: " + JSON.stringify( row ) + " \n result_rows : " + JSON.stringify(result_rows) );
                //console.log( "bb_obj: " + JSON.stringify(bb_obj) );
                ctx.meta.$responseType = "text/json ; charset=utf-8";
                return JSON.stringify( bb_obj );            
            }
            else
                return "Error /stella/db/skin_sell_order: rows_count = ";// + rows_count;  
        }, // populate(


        populate (args) 
        {
            PopulateDBCmd.GetSingleton().execute(args);
            return 'Lancement populate';
        }, // populate()


        backup ( args )
        {
            var main_window = Session.GetSingleton().getAppVar(Session.MainWindow)

            dialog.showSaveDialog
            ( main_window, 
            {   properties: ['saveFile'],
                title:  'backup-as',
                defaultPath : APP_ROOT_PATH + '\\data\\sql',
                filters: [ { name: 'SQL Files', extensions: ['sql'] } ]
            }
            ).then
            ( result => 
            {
                if ( result.canceled ) return;
                console.log (JSON.stringify(result));
                if ( result.filePath != undefined )
                {
                var output_sql_file_path = result.filePath;
                BackupDBCmd.GetSingleton().execute( output_sql_file_path );
                } // if 
            }
            ).catch( err => { console.log( err) });              
        }, //backup()


        restore ( args )
        {
            var main_window = Session.GetSingleton().getAppVar(Session.MainWindow)

            dialog.showOpenDialog
            ( main_window, 
              {   properties: ['openFile'],
                  title:  'restore',
                  defaultPath : APP_ROOT_PATH + '\\data\\sql',
                  filters: [ { name: 'SQL Files', extensions: ['sql'] } ]
              }
            ).then
            ( result => 
              {
                if ( result.canceled ) return;
                if ( result.filePaths.length == 1 )
                {
                  var input_sql_file_path = result.filePaths[0];
                  RestoreDBCmd.GetSingleton().execute ( input_sql_file_path );
                } // if 
              }
            )
        }, // restore

        query ( ctx ) 
        {
            //var app_var_value = Session.GetSingleton().getAppVar(ctx.params);
            console.log("params " + JSON.stringify(ctx.params));
            ProfitSelectSkinCmd.GetSingleton().execute (ctx.params)
            return 'Query';
        }
    } // actions
}; // 'db' service