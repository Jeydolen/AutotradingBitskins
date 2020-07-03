const assert            = require('assert');
const { Singleton }     = require('./singleton');
global.rekwire          = require('app-root-path').require;

const GUI = rekwire ('/src/gui/GUI.js').GUI;

class EventDispatcher extends Singleton
{
    static Singleton = null;

    constructor ( args )
    {
        super ( args )
        this.is_initialized = false;
        this.event_sinks    = new Map();

        GUI.EVENT.enums.forEach( (event) =>  { this.event_sinks.set( event.key, [] ); })
    } // constructor


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
