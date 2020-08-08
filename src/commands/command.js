const assert                = require ('assert');

const Konst = rekwire ('/src/constants.js');
const konsole = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL = rekwire ('/src/bb_log.js').LOG_LEVEL;

const COMMAND_SINGLETON = "COMMAND_SINGLETON";

//https://nodered.org/
class Command 
{
    static Instances = new Map();
    static Singleton = null;

    constructor( name)
    {
        //assert ( Command.Instances.size < 1) ; // Singleton Design Pattern
        this.name = name;
    }

    getName = () => {this.name}

    execute( args ) { konsole.log ( this.getName() + ': execute ()'); }

    static GetSingleton()
    {
        let klass = this;
        //console.log ("klass: " + klass.name);
        //console.log ("Bienvenue dans GetSingleton  de Command.js");3
        
        if (klass.Singleton == null || klass.Singleton == undefined )
        {
            let name = klass.name.toUpperCase() + "_SINGLETON";
            klass.Singleton = new klass(name) ;
            klass.Instances.set ( name, klass.Singleton );
        }
        return klass.Singleton;
    } // GetSingleton()
}
exports.Command = Command;