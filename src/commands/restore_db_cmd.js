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
        let fullpath_to_sql_input_file = mkDBFullPath(args);
        console.log (fullpath_to_sql_input_file)
        let child = exec(' mysql -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD + ' ' +  DB_NAME + ' < ' + fullpath_to_sql_input_file );

        child.on('exit', function (code) {
            if (code == 0)
                konsole.log('Restore succesfuly completed' , LOG_LEVEL.OK)
            else
                konsole.error('Restore failed code: ' + code)

          });
        
    }
}
exports.RestoreDBCmd = RestoreDBCmd;