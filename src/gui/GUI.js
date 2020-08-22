const Enum      = require('enum');

class GUI
{
    static UNKNOWN_EVT                  = "UNKNOWN_EVT";
    static POPULATE_DB_PROGRESS_EVT     = "POPULATE_DB_PROGRESS_EVT";
    static START_POPULATE_DB_EVT        = "START_POPULATE_DB_EVT";
    static BACKUP_DB_EVT                = "BACKUP_DB_EVT";
    static RESTORE_DB_EVT               = "RESTORE_DB_EVT";
    static PROFIT_SLCT_SKIN_EVT         = "PROFIT_SLCT_SKIN_EVT";
    static SHOW_DEV_TOOLS_EVT           = "SHOW_DEV_TOOLS_EVT";
    static APP_VAR_CHANGED_EVT          = "APP_VAR_CHANGED_EVT";
    static SUBMIT_VALUE_EVT             = "SUBMIT_VALUE_EVT";

    static EVENT                    = new Enum (
    {   UNKNOWN_EVT                 : 'unknown-evt', 
        POPULATE_DB_PROGRESS_EVT    : 'populate-db-progress', 
        START_POPULATE_DB_EVT       : 'start-populate-db',
        PROFIT_SLCT_SKIN_EVT        : 'profit-select-skin',
        BACKUP_DB_EVT               : 'backup-db',
        RESTORE_DB_EVT              : 'restore-db',
        SHOW_DEV_TOOLS_EVT          : 'show-dev-tools',
        APP_VAR_CHANGED_EVT         : 'app-var-changed',
        SUBMIT_VALUE_EVT            : 'submit-value-evt'
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

    static SubmitValueEventObj = class
    {
       constructor ( entity_name, entity_value )
        {
            this.entity_name = entity_name; 
            this.entity_value = entity_value; 
        }
    }; // SubmitValueEventObj klass

    static EVT_ARGS  = { POPULATE_DB_PROGRESS_EVT : GUI.PopulateDBEventObj, SUBMIT_VALUE_EVT : GUI.SubmitValueEventObj };
} // GUI Class

exports.GUI = GUI;