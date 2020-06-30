const assert                    = require ('assert');

const { Singleton }             = rekwire('/src/singleton');
const Konst                     = rekwire ('/src/constants.js');
const { konsole, LOG_LEVEL }    = rekwire ('/src/bb_log.js');


class Registry extends Singleton
{
    static Instances = new Map();
    static Singleton = null;

    constructor ( args )
    {
        super ( args );
        //assert ( Registry.Instances.size <1) ; // Singleton Design Pattern
        this.items  = new Map();
    }

    getItem = (key) =>
    {
        if ( this.items.has(key))
            return this.items.get( key );
        return Konst.NOTHING;
    }
    
    add = (key, item) =>
    {
        if ( ! this.items.has(key))
            this.items.set(key, item);
    }

    remove = (key) =>
    {
        if ( ! this.items.has(key))
            this.items.delete(key);
    }
} // Registry class


exports.Registry = Registry;