const timestamp             = require ('time-stamp');
const app_root_path         = require('app-root-path');
const path                  = require('path');
const exec                  = require('child_process').exec;

const { DB_NAME, ADMIN_NAME, ADMIN_PWD} = rekwire ('/src/bb_database.js');
const Konst                 = rekwire ('/src/constants.js');
const mkDBFullPath          = rekwire ('/src/db.js').mkDBFullPath;
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL;
const Command               = rekwire ('/src/commands/command.js').Command;
const BitskinsFetcher       = rekwire ('/src/bb_fetcher.js').BitskinsFetcher;

// https://www.geek-directeur-technique.com/2017/07/17/utilisation-de-mysqldump
class BackupDBCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
    }

    execute ( args )
    { 
        var fullpath_to_sql_output_file = mkDBFullPath(args);
        console.log (fullpath_to_sql_output_file);
        var child = exec(' mysqldump -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  DB_NAME + ' –skip-lock-tables –single-transaction' + ' > ' + fullpath_to_sql_output_file);
        konsole.log('Backup succesfuly completed', LOG_LEVEL.OK)  
    } // execute
}

exports.BackupDBCmd = BackupDBCmd;