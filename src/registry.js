const assert                    = require ('assert');

const Konst                     = rekwire ('/src/constants.js');
const { konsole, LOG_LEVEL }    = rekwire ('/src/bb_log.js');


class Registry
{
    static Instances = new Map();
    static Singleton = null;

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
        var klass = this;
        console.log ("klass: " + klass.name);

        console.log ("Bienvenue dans GetSingleton  de Registry.js");
        if (klass.Singleton == null || klass.Singleton == undefined )
        {
            var name = klass.name.toUpperCase() + "_SINGLETON";
            klass.Singleton = new klass(name) ;
            klass.Instances.set ( name, klass.Singleton );
        }
        return klass.Singleton;
    } // GetSingleton()
}


exports.Registry = Registry;