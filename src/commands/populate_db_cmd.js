const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL;
const Command               = rekwire ('/src/commands/command.js').Command;
const BitskinsFetcher       = rekwire ('/src/bb_fetcher.js').BitskinsFetcher;


const POPULATE_DB_CMD_SINGLETON = "POPULATE_DB_CMD_SINGLETON";

class PopulateDbCmd extends Command
{
    static Instances = new Map();
    static Singleton = PopulateDbCmd.GetSingleton();

    constructor( name ) 
    {
        super (name); 
        this.name = name;
    }

    getName() { return this.name; }

    execute ( args )
    {
        BitskinsFetcher.GetSingleton().populateDB();
    }

    static GetSingleton()
    {
       //console.log ("Bienvenue dans GetSingleton  de PopulateDbCmd.js");
        if (PopulateDbCmd.Singleton == null || PopulateDbCmd.Singleton == undefined )
        {
            PopulateDbCmd.Singleton = new PopulateDbCmd( POPULATE_DB_CMD_SINGLETON ) ;
            PopulateDbCmd.Instances.set ( POPULATE_DB_CMD_SINGLETON, PopulateDbCmd.Singleton );
        }
        return PopulateDbCmd.Singleton;
    } // GetSingleton()
}
exports.PopulateDbCmd = PopulateDbCmd;