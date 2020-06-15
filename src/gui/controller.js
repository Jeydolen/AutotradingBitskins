const assert                = require ('assert');
const { ipcMain }           = require( 'electron' );

const BitskinsFetcher       = rekwire( '/src/bb_fetcher.js').BitskinsFetcher;

const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL ;
const EventDispatcher       = rekwire ('/src/event_dispatcher.js').EventDispatcher;
const EVENTS                = rekwire ('/src/event_dispatcher.js').EVENTS;
const POPULATE_DB_PROGRESS  = rekwire ('/src/event_dispatcher.js').POPULATE_DB_PROGRESS;
const START_UPDATE_DB       = rekwire ('/src/event_dispatcher.js').START_UPDATE_DB;

const CONTROLLER_SINGLETON = "CONTROLLER_SINGLETON";
const CONTROLLER = "CONTROLLER";

class Controller 
{
    static Singleton = null;
    static Instances = new Map();

    constructor ( main_window_arg )
    {
        console.log ("Bienvenue dans controller.js");
        this.name = CONTROLLER;
        assert ( Controller.Instances.size <1) ; // Singleton Design Pattern
        this.main_window = main_window_arg;
        this.subscribeToEvents();
    } // constructor

    subscribeToEvents ()
    {
        ipcMain.on( START_UPDATE_DB, function (event, arg) 
        {
            console.log ('Test controller.js')
            BitskinsFetcher.GetSingleton().updateDb()
        });
        
        EventDispatcher.GetSingleton().subscribe(this, EVENTS.get(POPULATE_DB_PROGRESS));
    } // subscribeToEvents ()


    inform ( event, args )
    {
        assert ( EVENTS.isDefined( event ));
        konsole.log("Controller.inform " + EVENTS[ POPULATE_DB_PROGRESS ].value + " " + args);
        this.main_window.webContents.send( EVENTS[ POPULATE_DB_PROGRESS ].value, args );
    } // constructor


    static GetSingleton( main_window )
    {
        console.log ("Bienvenue dans GetSingleton  de controller.js");
        if (Controller.Singleton == null || Controller.Singleton == undefined )
        {
            Controller.Singleton = new Controller( main_window ) ;
            Controller.Instances.set ( CONTROLLER_SINGLETON, Controller.Singleton );
        }
        return Controller.Singleton;
    } // GetSingleton()
} // Controller
exports.Controller = Controller;