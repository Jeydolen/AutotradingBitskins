const { dialog }    = require( 'electron' );
const APP_ROOT_PATH = require ('app-root-path');

const Session           = rekwire ('/src/session.js').Session;
const ShowDevToolsCmd   = rekwire ('/src/commands/show_dev_tools_cmd.js').ShowDevToolsCmd;
const BackupDBCmd       = rekwire ('/src/commands/backup_db_cmd.js').BackupDBCmd;




module.exports =
{
    name: "gui",
    settings: 
    {
        routes: 
        [
            { path: "/gui" }
        ]
    },
    actions: 
    { 
        show_dev_tools (args) 
        {
            ShowDevToolsCmd.GetSingleton().execute(args)
            return 'Show dev tools';
        },
        backup_as ( args )
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
        }
    }
};