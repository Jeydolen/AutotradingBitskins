const assert                = require ('assert');

const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL ;
const EventDispatcher       = rekwire ('/src/event_dispatcher.js').EventDispatcher;
const EVENTS                = rekwire ('/src/event_dispatcher.js').EVENTS;
const POPULATE_DB_PROGRESS  = rekwire ('/src/event_dispatcher.js').POPULATE_DB_PROGRESS;

const CONTROLLER_SINGLETON = "CONTROLLER_SINGLETON";

class Controller 
{
    static Singleton = null;
    static Instances = new Map();

    constructor ( main_window_arg )
    {
        assert ( Controller.Instances.size <1) ; // Singleton Design Pattern
        this.main_window = main_window_arg;
        EventDispatcher.Subscribe( this, EVENTS[ POPULATE_DB_PROGRESS ] );
    } // constructor

    inform ( event, args )
    {
        assert ( EVENTS.isDefined( event ));
        console.log("Controller.inform " + EVENTS[ POPULATE_DB_PROGRESS ].value + " " + args);
        this.main_window.webContents.send( EVENTS[ POPULATE_DB_PROGRESS ].value, args );
    } // constructor

    static GetSingleton( main_window )
    {
        if (Controller.Singleton == undefined)
        {
            Controller.Singleton = new Controller( main_window ) ;
            Controller.Instances.set ( CONTROLLER_SINGLETON, Controller.Singleton );
        }
        return Controller.Singleton;
    } // GetSingleton()
} // Controller
exports.Controller = Controller;