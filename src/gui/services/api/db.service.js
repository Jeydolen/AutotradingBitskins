const { dialog }    = require( 'electron' );
const APP_ROOT_PATH = require ('app-root-path');

const Session           = rekwire ('/src/session.js').Session;
const PopulateDBCmd = rekwire ('/src/commands/populate_db_cmd.js').PopulateDBCmd;
const BackupDBCmd = rekwire ('/src/commands/backup_db_cmd.js').BackupDBCmd;

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
        populate (args) 
        {
            PopulateDBCmd.GetSingleton().execute(args);
            return 'Lancement populate';
        }, 
        backup (args) 
        {
            let file_name = args.params.file
            console.log('Backup : ' + file_name);
            BackupDBCmd.GetSingleton().execute(file_name);
            return 'Lancement backup';
        },
        backup_as ( args )
        {
            let main_window = Session.GetSingleton().getAppVar(Session.MainWindow)

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
                let output_sql_file_path = result.filePath;
                BackupDBCmd.GetSingleton().execute( output_sql_file_path );
                } // if 
            }
            ).catch( err => { console.log( err) });              
        }
    }
};