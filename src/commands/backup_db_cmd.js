const timestamp             = require ('time-stamp');
const app_root_path         = require('app-root-path');
const path                  = require('path');
const exec                  = require('child_process').exec;

const { DB_NAME, ADMIN_NAME, ADMIN_PWD} = rekwire ('/src/bb_database.js');
const mkDBFullPath          = rekwire ('/src/db.js').mkDBFullPath;
const { konsole, LOG_LEVEL} = rekwire ('/src/bb_log.js');
const Command               = rekwire ('/src/commands/command.js').Command;

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
        let fullpath_to_sql_output_file = mkDBFullPath(args);
        let child = exec(' mysqldump -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  DB_NAME + ' > ' + fullpath_to_sql_output_file);
        

       child.on('exit', function (code) {
        if (code == 0)
            konsole.log('Backup succesfuly completed', LOG_LEVEL.OK)  
        else
            konsole.error('Backup failed code: ' + code)

      });
      

    } // execute
}

exports.BackupDBCmd = BackupDBCmd;