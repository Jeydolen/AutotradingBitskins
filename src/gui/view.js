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

const VIEW_SINGLETON = "VIEW_SINGLETON";
const VIEW = "VIEW";

class View 
{
    static Singleton = null;
    static Instances = new Map();

    constructor ( main_window_arg )
    {
        //console.log ("Bienvenue dans controller.js");
        this.name = VIEW;
        assert ( View.Instances.size <1) ; // Singleton Design Pattern
        this.main_window = main_window_arg;
    } // constructor


    dispatch ( event, args ) 
    {
        assert (event != undefined );
        assert (event.key != undefined)
        assert ( GUI.EVENT.isDefined( event.key ));

        console.log("View.js event:" + event);
        EventDispatcher.GetSingleton().dispatch(event, args);

        /*for ( var i=0; i< this.event_sinks.get( event.key ).length; i++ )
        {
            //console.log('Yo');
            var event_sink_obj = this.event_sinks.get( event.key )[i];

            if (event_sink_obj != undefined) 
            { 
                //console.log('Yolo');
                event_sink_obj.inform( event.key, args );
            }
        }
        */
    } // Dispatch()


    static GetSingleton( main_window )
    {
       //console.log ("Bienvenue dans GetSingleton  de controller.js");
        if (View.Singleton == null || View.Singleton == undefined )
        {
            View.Singleton = new View( main_window ) ;
            View.Instances.set ( VIEW_SINGLETON, View.Singleton );
        } 
        return View.Singleton;
    } // GetSingleton()
} // View
exports.View = View;