const Enum      = require('enum');
const expand    = require ('expand-template')();

class GUI
{
    static POPULATE_DB_PROGRESS_EVT = "POPULATE_DB_PROGRESS_EVT";
    static START_UPDATE_DB_EVT = "START_UPDATE_DB_EVT";
    static UNKNOWN_EVT  = "UNKNOWN_EVT";
    static EVENTS       = new Enum ({ UNKNOWN_EVT: "unknown-evt", POPULATE_DB_PROGRESS_EVT : 'populate-db-progress', START_UPDATE_DB_EVT : 'start-update-db'});
   
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