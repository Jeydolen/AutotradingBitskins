const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL;
const Command               = rekwire ('/src/commands/command.js').Command;
const BitskinsFetcher       = rekwire ('/src/bb_fetcher.js').BitskinsFetcher;


const POPULATE_DB_CMD_SINGLETON = "POPULATE_DB_CMD_SINGLETON";

class PopulateDbCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
    }


    execute ( args )
    {
        BitskinsFetcher.GetSingleton().populateDB();
    }
}
exports.PopulateDbCmd = PopulateDbCmd;