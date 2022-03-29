const assert            = require('assert');
const { ipcMain }       = require( 'electron' );

if (global.rekwire == undefined)
    global.rekwire  = require ('app-root-path').require;

const Singleton     = rekwire ('/src/singleton.js').Singleton;
const GUI           = rekwire ('/src/gui/GUI.js').GUI;
const { konsole, LOG_LEVEL} = rekwire ('/src/bb_log.js');
const obj2string    = rekwire ('/src/utility.js').objToString;
const mapToObj      = rekwire ('/src/utility.js').mapToObj;

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

        GUI.EVENT.enums.forEach( (event) =>  { this.event_sinks.set( event, [] ); })
    } // constructor

    init ()
    {
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
            konsole.log ("Not electron", LOG_LEVEL.INFO);
    }

    subscribe ( event_sink_obj, event ) 
    {
        assert ( GUI.EVENT.isDefined( event ), event);

        let evt_sink_get = this.event_sinks.get( event );
        if ( evt_sink_get.indexOf (event_sink_obj) == -1 )
        {
            evt_sink_get.push( event_sink_obj );
        }
    } // Subscribe()

    
    dispatch ( event, args ) 
    {
        assert (event != undefined );
        assert (event.key != undefined)
        assert ( GUI.EVENT.isDefined( event.key ));
        assert (this.event_sinks != null, this.event_sinks)
        let evt_sink_get = this.event_sinks.get( event )

        if ( evt_sink_get == null || evt_sink_get == undefined)
        {
            konsole.error ( 'Event dispatcher ' + evt_sink_get + JSON.stringify(event.value) + JSON.stringify(this.event_sinks)  )
            return 0;
        }
           

        for ( let i=0; i< evt_sink_get.length; i++ )
        {
            let event_sink_obj = this.event_sinks.get( event )[i];

            if (event_sink_obj != undefined) 
            { 
                event_sink_obj.inform( event, args );
            }
   
        }
    } // Dispatch()
} // EventDispatcher

exports.EventDispatcher         = EventDispatcher;
