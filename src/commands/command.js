const assert                = require ('assert');

const Konst = rekwire ('/src/constants.js');
const konsole = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL = rekwire ('/src/bb_log.js').LOG_LEVEL;

const COMMAND_SINGLETON = "COMMAND_SINGLETON";

//https://nodered.org/
class Command 
{
    static Instances = new Map();
    static Singletons = new Map();

    constructor( name)
    {
        assert ( Command.Instances.size <1) ; // Singleton Design Pattern
        this.name = name
    }

    getName = () => {this.name}

    execute( args ) { konsole.log ( this.getName() + ': execute ()'); }

    static GetSingleton()
    {
        var klass = this;
        console.log ("klass: " + klass.name);
        var singleton_name = klass.name.toUpperCase() + "_SINGLETON";

        console.log ("Bienvenue dans GetSingleton  de Command.js " + singleton_name);

        var klass_singleton = klass.Singletons.get( singleton_name );
        if ( klass_singleton == undefined )
        {
            klass_singleton = new klass(singleton_name) ;
            klass.Instances.set     ( singleton_name, klass_singleton );
            klass.Singletons.set    ( singleton_name, klass_singleton );
        }
        return klass_singleton;
    } // GetSingleton()
}
exports.Command = Command;