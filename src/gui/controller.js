const assert                = require ('assert');
const { ipcMain }           = require( 'electron' );

const BitskinsFetcher       = rekwire( '/src/bb_fetcher.js').BitskinsFetcher;

const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL ;
const EventDispatcher       = rekwire ('/src/event_dispatcher.js').EventDispatcher;
const GUI                   = rekwire ('/src/gui/GUI.js').GUI;
const CommandRegistry       = rekwire ('/src/commands/command_registry.js').CommandRegistry;
const CMD_KONST             = rekwire ('/src/commands/command_constants.js').CMD_KONST;

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
        ipcMain.on( GUI.EVENTS.get(GUI.START_POPULATE_DB_EVT).value, function (event, arg) 
        {
            //console.log ('Test controller.js')
            var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.POPULATE_DB_ID );
            cmd_klass.GetSingleton().execute(null);
        });
        
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENTS.get(GUI.POPULATE_DB_PROGRESS_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENTS.get(GUI.START_POPULATE_DB_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENTS.get(GUI.STOP_IPC_MAIN_EVT) );
    } // subscribeToEvents ()


    inform ( event, args )
    {
        assert ( GUI.EVENTS.isDefined( event ));

        console.log ('controller.js inform event: ' + event);
        
        if (event == GUI.EVENTS.get(GUI.POPULATE_DB_PROGRESS_EVT).key )
            this.main_window.webContents.send( GUI.EVENTS.get(GUI.POPULATE_DB_PROGRESS_EVT).value, args );

        else if (event == GUI.EVENTS.get(GUI.START_POPULATE_DB_EVT).key)
        {
            var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.POPULATE_DB_ID );
            cmd_klass.GetSingleton().execute(null);
        }

        else if (event == GUI.EVENTS.get(GUI.STOP_IPC_MAIN_EVT).key)
        {
           console.log("STOP");
        }

        else return Konst.RC.KO;
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