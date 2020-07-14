const assert            = require('assert');
const { ipcMain }       = require( 'electron' );

if (global.rekwire == undefined)
    global.rekwire = require ('app-root-path').require;

const Singleton = rekwire ('/src/singleton.js').Singleton;
const GUI       = rekwire ('/src/gui/GUI.js').GUI;
const { konsole, LOG_LEVEL} = rekwire ('/src/bb_log.js');
const obj2string = rekwire ('/src/utility.js').objToString;

class EventDispatcher extends Singleton
{
    static Singleton = null;

    constructor ( args )
    {
        super ( args );
        this.is_initialized = false;
        this.event_sinks    = new Map();
        //this.subscribers = new Map();
        this.init();

        GUI.EVENT.enums.forEach( (event) =>  { this.event_sinks.set( event, [] ); console.log ( obj2string(event)) })
    } // constructor

    init ()
    {
        konsole.log ('Salut toi !!!!!!!!xXXXXXXXXXXXXXXXXXXXXXXxXXXXXXXXXXXXXXXXXXXXx', LOG_LEVEL.OK)
        if (ipcMain != undefined)
        {  
            ipcMain.on( GUI.EVENT.get(GUI.START_POPULATE_DB_EVT).value, function (event, arg) 
            { EventDispatcher.GetSingleton().dispatch ( GUI.EVENT[GUI.START_POPULATE_DB_EVT], arg); });

            ipcMain.on( GUI.EVENT.get(GUI.PROFIT_SLCT_SKIN_EVT).value, function (event, arg) 
            { EventDispatcher.GetSingleton().dispatch ( GUI.EVENT[GUI.PROFIT_SLCT_SKIN_EVT], arg); });

            ipcMain.on( GUI.EVENT.get(GUI.SHOW_DEV_TOOLS_EVT).value, function (event, arg) 
            { EventDispatcher.GetSingleton().dispatch ( GUI.EVENT[GUI.SHOW_DEV_TOOLS_EVT], arg); });

            ipcMain.on( GUI.EVENT.get(GUI.SUBMIT_VALUE_EVT).value, function (event, arg) 
            { EventDispatcher.GetSingleton().dispatch ( GUI.EVENT[GUI.SUBMIT_VALUE_EVT], arg); });
        }
        else
            konsole.log ("C'est pas electron", LOG_LEVEL.INFO);
    }

    subscribe ( event_sink_obj, event ) 
    {

        konsole.log('Subscribe event_dispatcher : ' + JSON.stringify(event_sink_obj) + event, LOG_LEVEL.INFO);
        assert ( GUI.EVENT.isDefined( event ), event);
        if (this.event_sinks.get( event ).indexOf (event_sink_obj) == -1)
        {
            var registered_event_sinks = this.event_sinks.get( event );
            this.event_sinks.get( event ).push( event_sink_obj );
            registered_event_sinks = this.event_sinks.get( event );
        }
    } // Subscribe()

    
    dispatch ( event, args ) 
    {
        assert (event != undefined );
        assert (event.key != undefined)
        assert ( GUI.EVENT.isDefined( event.key ));
        //console.log ('Before yo' + event.key)

        for ( var i=0; i< this.event_sinks.get( event ).length; i++ )
        {
            //console.log('Yo' + event.key);
            var event_sink_obj = this.event_sinks.get( event )[i];

            if (event_sink_obj != undefined) 
            { 
                //console.log('Yolo event_sink_obj ' + event_sink_obj.name);
                event_sink_obj.inform( event, args );
            }
   
        }
    } // Dispatch()
} // EventDispatcher

exports.EventDispatcher         = EventDispatcher;
