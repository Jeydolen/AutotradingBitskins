const assert                = require ('assert');

const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL ;


const REGISTRY_SINGLETON = "REGISTRY_SINGLETON";

class Registry
{
    static Instances = new Map();
    static Singleton = Registry.GetSingleton();

    constructor ( name )
    {
        //assert ( Registry.Instances.size <1) ; // Singleton Design Pattern
        this.name   = name
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


    static GetSingleton()
    {
       //console.log ("Bienvenue dans GetSingleton  de Registry.js");
        if (Registry.Singleton == null || Registry.Singleton == undefined )
        {
            Registry.Singleton = new Registry() ;
            Registry.Instances.set ( REGISTRY_SINGLETON, Registry.Singleton );
        }
        return Registry.Singleton;
    } // GetSingleton()
}


exports.Registry = Registry;