const assert                = require ('assert');
const { ipcMain }           = require( 'electron' );

const BitskinsFetcher       = rekwire( '/src/bb_fetcher.js').BitskinsFetcher;

const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL ;
const EventDispatcher       = rekwire ('/src/event_dispatcher.js').EventDispatcher;
const GUI                = rekwire ('/src/gui/GUI.js').GUI;

const CONTROLLER_SINGLETON = "CONTROLLER_SINGLETON";
const CONTROLLER = "CONTROLLER";

class Controller 
{
    static Singleton = null;
    static Instances = new Map();

    constructor ( main_window_arg )
    {
        //console.log ("Bienvenue dans controller.js");
        this.name = CONTROLLER;
        assert ( Controller.Instances.size <1) ; // Singleton Design Pattern
        this.main_window = main_window_arg;
        this.subscribeToEvents();
    } // constructor

    subscribeToEvents ()
    {
        ipcMain.on( GUI.START_UPDATE_DB_EVT, function (event, arg) 
        {
            //console.log ('Test controller.js')
            BitskinsFetcher.GetSingleton().populateDB()
        });
        
        EventDispatcher.GetSingleton().subscribe(this, GUI.EVENTS.get(GUI.POPULATE_DB_PROGRESS_EVT));
    } // subscribeToEvents ()


    inform ( event, args )
    {
        assert ( GUI.EVENTS.isDefined( event ));
        //konsole.log("Controller.inform " + EVENTS[ POPULATE_DB_PROGRESS ].value + " " + args);
        this.main_window.webContents.send( GUI.EVENTS.get(GUI.POPULATE_DB_PROGRESS_EVT).value, args );
    } // constructor


    static GetSingleton( main_window )
    {
       //console.log ("Bienvenue dans GetSingleton  de controller.js");
        if (Controller.Singleton == null || Controller.Singleton == undefined )
        {
            Controller.Singleton = new Controller( main_window ) ;
            Controller.Instances.set ( CONTROLLER_SINGLETON, Controller.Singleton );
        }
        return Controller.Singleton;
    } // GetSingleton()
} // Controller
exports.Controller = Controller;