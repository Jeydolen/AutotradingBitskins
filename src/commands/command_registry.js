const assert                = require ('assert');

const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL ;
const Registry             = rekwire ('/src/registry.js').Registry ;

const COMMAND_REGISTRY_SINGLETON = "COMMAND_REGISTRY_SINGLETON";

class CommandRegistry extends Registry
{
    static Instances = new Map();
    static Singleton = CommandRegistry.GetSingleton();
   
    constructor (name) { super ( name ); }

    static GetSingleton()
    {
       //console.log ("Bienvenue dans GetSingleton  de CommandRegistry.js");
        if (CommandRegistry.Singleton == null || CommandRegistry.Singleton == undefined )
        {
            CommandRegistry.Singleton = new CommandRegistry() ;
            CommandRegistry.Instances.set ( COMMAND_REGISTRY_SINGLETON, CommandRegistry.Singleton );
        }
        return CommandRegistry.Singleton;
    } // GetSingleton()
}


exports.CommandRegistry = CommandRegistry;