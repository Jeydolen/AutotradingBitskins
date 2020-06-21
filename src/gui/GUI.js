const Enum      = require('enum');
const expand    = require ('expand-template')();

class GUI
{
    static UNKNOWN_EVT                  = "UNKNOWN_EVT";
    static POPULATE_DB_PROGRESS_EVT     = "POPULATE_DB_PROGRESS_EVT";
    static START_POPULATE_DB_EVT        = "START_POPULATE_DB_EVT";
    static BACKUP_DB_EVT                = "BACKUP_DB_EVT";
    static RESTORE_DB_EVT               = "RESTORE_DB_EVT";
    static STOP_IPC_MAIN_EVT            = "STOP_IPC_MAIN_EVT";

    static EVENTS       = new Enum (
    {   UNKNOWN_EVT                 : 'unknown-evt', 
        POPULATE_DB_PROGRESS_EVT    : 'populate-db-progress', 
        START_POPULATE_DB_EVT       : 'start-populate-db',
        STOP_IPC_MAIN_EVT           : 'stop-ipc-main',
        BACKUP_DB_EVT               : 'backup-db',
        RESTORE_DB_EVT              : 'restore-db'
    } );
   

    static PopulateDBEventObj = class
    {
       constructor (type, value, max_value, page)
        {
            this.type = type; 
            this.value = value; 
            this.max_value = max_value; 
            this.page = page;
        }
    }; // PopulateDBEventObj klass
    

    static EVT_ARGS  = { POPULATE_DB_PROGRESS_EVT : GUI.PopulateDBEventObj };
} // GUI klass


const test_2 = () =>
{
   var obj_func = GUI.EVT_ARGS[GUI.POPULATE_DB_PROGRESS_EVT]
   console.log (obj_func);
   var obj = new obj_func ('Weapon', 256, 480, 64 );
   console.log ("object:" +JSON.stringify(obj))
};

exports.GUI = GUI;