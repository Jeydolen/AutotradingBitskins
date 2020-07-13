const { Config } = require("../config");

const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL;
const Command               = rekwire ('/src/commands/command.js').Command;
const BitskinsFetcher       = rekwire ('/src/bb_fetcher.js').BitskinsFetcher;


class PopulateDBCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
    }

    execute ( args )
    {
        var config_obj = Config.GetSingleton();
        var start_page_index = config_obj.getAppVar(Config.PageIndexStart);
        BitskinsFetcher.GetSingleton().populateDB(start_page_index);
    }
}
exports.PopulateDBCmd = PopulateDBCmd;