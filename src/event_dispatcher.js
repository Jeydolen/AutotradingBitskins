const assert = require('assert');
const Enum   = require('enum');

const Konst = rekwire('/src/constants.js');

const POPULATE_DB_PROGRESS = "POPULATE_DB_PROGRESS";
const START_UPDATE_DB = "START_UPDATE_DB";
const EVENT_DISPATCHER_SINGLETON = "EVENT_DISPATCHER_SINGLETON";

const EVENTS = new Enum ({ "Unknown": Konst.NOTHING, POPULATE_DB_PROGRESS : 'populate-db-progress', START_UPDATE_DB : 'start-update-db'});

class EventDispatcher
{
    static Instances = new Map();
    static Singleton = EventDispatcher.GetSingleton();

    constructor ()
    {
        this.is_initialized = false;
        this.event_sinks    = new Map();

        EVENTS.enums.forEach( (event) => 
        {
            console.log("event.key: "+ event.key);
            console.log("event.value: "+ event.value);
            this.event_sinks.set( event.key, [] );
        })
    } // constructor

    static GetSingleton()
    {
        console.log ("Bienvenue dans GetSingleton  de EventDispatcher.js");
        if (EventDispatcher.Singleton == null || EventDispatcher.Singleton == undefined )
        {
            EventDispatcher.Singleton = new EventDispatcher() ;
            EventDispatcher.Instances.set ( EVENT_DISPATCHER_SINGLETON, EventDispatcher.Singleton );
        }
        return EventDispatcher.Singleton;
    } // GetSingleton()


    subscribe ( event_sink_obj, event ) 
    {
        console.log("subscribe event_sink_obj: " + event_sink_obj.name + " event: " + event.key);
        assert ( EVENTS.isDefined( event ));
        if (this.event_sinks.get( event.key ).indexOf (event_sink_obj) == -1)
        {
            console.log("event_sink_obj pas déjà enreguistré");

            var registered_event_sinks = this.event_sinks.get( event.key );
            console.log(JSON.stringify(registered_event_sinks));

            this.event_sinks.get( event.key ).push( event_sink_obj );

            registered_event_sinks = this.event_sinks.get( event.key );
            console.log(JSON.stringify(registered_event_sinks));
        }
    } // Subscribe()


    dispatch ( event, args ) 
    {
        assert (event != undefined && event.key != undefined)
        assert ( EVENTS.isDefined( event.key ));

        console.log ("event_sinks.get(event) " + event.key );

        for ( var i=0; i< this.event_sinks.get( event.key ).length; i++ )
        {
            var event_sink_obj = this.event_sinks.get( event.key )[i];
            if (event_sink_obj != undefined)
            {
                console.log("!!!!!!!!!!!!!!!!!!!!!!!!!XXXXXXXXxXXXXXXX    " + event_sink_obj.toString());
                event_sink_obj.inform( event, args );
            }
   
        }
    } // Dispatch()
} // EventDispatcher

exports.EVENTS = EVENTS;
exports.POPULATE_DB_PROGRESS    = POPULATE_DB_PROGRESS;
exports.START_UPDATE_DB         = START_UPDATE_DB;
exports.EventDispatcher         = EventDispatcher;
