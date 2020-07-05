const exec                  = require('child_process').exec;

const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL;
const Command               = rekwire ('/src/commands/command.js').Command;
const BitskinsFetcher       = rekwire ('/src/bb_fetcher.js').BitskinsFetcher;
const { DB_NAME, ADMIN_NAME, ADMIN_PWD} = rekwire ('/src/bb_database.js');
const mkDBFullPath          = rekwire ('/src/db.js').mkDBFullPath;


class RestoreDBCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
    }

    execute ( args )
    {
        var fullpath_to_sql_input_file = mkDBFullPath(args);
        var child = exec(' mysql -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  DB_NAME + ' < ' + fullpath_to_sql_input_file);
        konsole.log('Restore succesfuly completed', LOG_LEVEL.OK)
    }
}
exports.RestoreDBCmd = RestoreDBCmd;