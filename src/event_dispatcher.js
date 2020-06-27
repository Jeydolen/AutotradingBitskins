const assert = require('assert');
global.rekwire        = require('app-root-path').require;

const GUI = rekwire ('/src/gui/GUI.js').GUI;

const EVENT_DISPATCHER_SINGLETON = "EVENT_DISPATCHER_SINGLETON";

class EventDispatcher
{
    static Instances = new Map();
    static Singleton = EventDispatcher.GetSingleton();

    constructor ()
    {
        this.is_initialized = false;
        this.event_sinks    = new Map();

        GUI.EVENT.enums.forEach( (event) =>  { this.event_sinks.set( event.key, [] ); })
    } // constructor

    static GetSingleton()
    {
        if (EventDispatcher.Singleton == null || EventDispatcher.Singleton == undefined )
        {
            EventDispatcher.Singleton = new EventDispatcher() ;
            EventDispatcher.Instances.set ( EVENT_DISPATCHER_SINGLETON, EventDispatcher.Singleton );
        }
        return EventDispatcher.Singleton;
    } // GetSingleton()


    subscribe ( event_sink_obj, event ) 
    {

        //console.log('Subscrobe event_dispatcher : ' + JSON.stringify(event_sink_obj) + event);
        assert ( GUI.EVENT.isDefined( event ), event);
        if (this.event_sinks.get( event.key ).indexOf (event_sink_obj) == -1)
        {
            var registered_event_sinks = this.event_sinks.get( event.key );
            this.event_sinks.get( event.key ).push( event_sink_obj );
            registered_event_sinks = this.event_sinks.get( event.key );
        }
    } // Subscribe()


    dispatch ( event, args ) 
    {
        assert (event != undefined );
        assert (event.key != undefined)
        assert ( GUI.EVENT.isDefined( event.key ));

        for ( var i=0; i< this.event_sinks.get( event.key ).length; i++ )
        {
            //console.log('Yo');
            var event_sink_obj = this.event_sinks.get( event.key )[i];

            if (event_sink_obj != undefined) 
            { 
                //console.log('Yolo');
                event_sink_obj.inform( event.key, args );
            }
   
        }
    } // Dispatch()
} // EventDispatcher

exports.EventDispatcher         = EventDispatcher;
