const Enum      = require('enum');
const expand    = require ('expand-template')();

const objToString = rekwire ('/src/utility.js').objToString;

class GUI
{
    static UNKNOWN_EVT                  = "UNKNOWN_EVT";
    static POPULATE_DB_PROGRESS_EVT     = "POPULATE_DB_PROGRESS_EVT";
    static START_POPULATE_DB_EVT        = "START_POPULATE_DB_EVT";
    static BACKUP_DB_EVT                = "BACKUP_DB_EVT";
    static RESTORE_DB_EVT               = "RESTORE_DB_EVT";
    static PROFIT_SLCT_SKIN_EVT         = "PROFIT_SLCT_SKIN_EVT";
    static SHOW_DEV_TOOLS_EVT           = "SHOW_DEV_TOOLS_EVT";

    static EVENT                    = new Enum (
    {   UNKNOWN_EVT                 : 'unknown-evt', 
        POPULATE_DB_PROGRESS_EVT    : 'populate-db-progress', 
        START_POPULATE_DB_EVT       : 'start-populate-db',
        PROFIT_SLCT_SKIN_EVT        : 'profit-select-skin',
        BACKUP_DB_EVT               : 'backup-db',
        RESTORE_DB_EVT              : 'restore-db',
        SHOW_DEV_TOOLS_EVT          : 'show-dev-tools'
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

const test = () =>
{
   console.log (objToString(GUI.EVENT));
};

//test();

exports.GUI = GUI;