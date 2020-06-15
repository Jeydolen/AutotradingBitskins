const assert = require('assert');
const Enum   = require('enum');

const Konst = rekwire('/src/constants.js');

const POPULATE_DB_PROGRESS = "POPULATE_DB_PROGRESS";

const EVENTS = new Enum ({ "Unknown": Konst.NOTHING, POPULATE_DB_PROGRESS : 'populate-db-progress'});

class EventDispatcher
{
    static #is_initialized  = false;
    static #EventSinks      = new Map();

    static Init() 
    {
        if ( EventDispatcher.#is_initialized) return;

        EVENTS.enums.forEach( (event) => 
        {
            console.log("event.key: "+ event.key);
            console.log("event.value: "+ event.value);
            EventDispatcher.#EventSinks.set(event.key, [] );
        })
        EventDispatcher.#is_initialized = true;
    } // init()


    static Subscribe ( event_sink_obj, event ) 
    {
        EventDispatcher.Init();
        assert ( EVENTS.isDefined( event ));
        EventDispatcher.#EventSinks.get( event.key ).push( event_sink_obj );
    } // Subscribe()


    static Dispatch ( event, args ) 
    {
        assert ( EventDispatcher.#is_initialized );
        assert ( EVENTS.isDefined( event ));
        for ( const event_sink_obj in EventDispatcher.#EventSinks.get( event ) )
        {
            event_sink_obj.inform( event, args );
        }
    } // Dispatch()
} // EventDispatcher

exports.EVENTS = EVENTS;
exports.POPULATE_DB_PROGRESS = POPULATE_DB_PROGRESS;
exports.EventDispatcher = EventDispatcher;
