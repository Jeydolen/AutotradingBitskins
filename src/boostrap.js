const assert                = require ('assert');

const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL ;
const CommandRegistry       = rekwire ('/src/commands/command_registry.js').CommandRegistry;
const PopulateDbCmd         = rekwire ('/src/commands/populate_db_cmd.js').PopulateDbCmd;


const BOOSTRAP_SINGLETON = "BOOSTRAP_SINGLETON";

class Boostrap
{
    static POPULATE_DB_ID = "populate-db-id";
    static Instances = new Map();
    static Singleton = Boostrap.GetSingleton();
    
    constructor (args)
    {
        assert ( Boostrap.Instances.size <1) ; // Singleton Design Pattern
    }

    init = () =>
    {
        CommandRegistry.GetSingleton().add( Boostrap.POPULATE_DB_ID, PopulateDbCmd );
    }

    static GetSingleton()
    {
       //console.log ("Bienvenue dans GetSingleton  de Boostrap.js");
        if (Boostrap.Singleton == null || Boostrap.Singleton == undefined )
        {
            Boostrap.Singleton = new Boostrap() ;
            Boostrap.Instances.set ( BOOSTRAP_SINGLETON, Boostrap.Singleton );
        }
        return Boostrap.Singleton;
    } // GetSingleton()
}
exports.Boostrap = Boostrap;