const assert                = require ('assert');

const Konst = rekwire ('/src/constants.js');
const konsole = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL = rekwire ('/src/bb_log.js').LOG_LEVEL;

const COMMAND_SINGLETON = "COMMAND_SINGLETON";

//https://nodered.org/
class Command 
{
    static Instances = new Map();
    static Singleton = Command.GetSingleton();

    constructor( name)
    {
        assert ( Command.Instances.size <1) ; // Singleton Design Pattern
        this.name = name
    }

    getName = () => {this.name}

    execute( args )
    {
        konsole.log ( this.getName() + ': execute ()');
    }

    static GetSingleton()
    {
       //console.log ("Bienvenue dans GetSingleton  de Command.js");
        if (Command.Singleton == null || Command.Singleton == undefined )
        {
            Command.Singleton = new Command() ;
            Command.Instances.set ( COMMAND_SINGLETON, Command.Singleton );
        }
        return Command.Singleton;
    } // GetSingleton()
}
exports.Command = Command;