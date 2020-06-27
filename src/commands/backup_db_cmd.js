const timestamp             = require ('time-stamp');
const app_root_path         = require('app-root-path');
const exec                  = require('child_process').exec;
if (global.rekwire == undefined)
    global.rekwire = require('app-root-path').require;

const { DB_NAME, ADMIN_NAME, ADMIN_PWD} = rekwire ('/src/bb_database.js');
const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL;
const Command               = rekwire ('/src/commands/command.js').Command;
const BitskinsFetcher       = rekwire ('/src/bb_fetcher.js').BitskinsFetcher;


class BackupDBCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
    }

    execute ( args )
    { 
        var fullpath_to_sql_output_file = Konst.NOTHING;
        if (args == null)
        {
            var now_time_stamp = timestamp('YYYY_MM_DD_HH_mm');
            fullpath_to_sql_output_file = app_root_path + '/data/sql/' + DB_NAME + '_' + now_time_stamp + '.sql';
        }   
        else fullpath_to_sql_output_file = args;
        console.log (args);
        var child = exec(' mysqldump -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  DB_NAME + ' > ' + fullpath_to_sql_output_file);
        konsole.log('Backup succesfuly completed', LOG_LEVEL.OK)
    }
}

exports.BackupDBCmd = BackupDBCmd;