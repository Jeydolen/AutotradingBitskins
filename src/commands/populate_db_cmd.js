const Session               = rekwire ('/src/session.js').Session;
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

    execute ( reason  = Konst.Reason.Populate)
    {
        var session_obj = Session.GetSingleton();
        var start_page_index = session_obj.getAppVar( Session.PageIndexStart );
        konsole.log ("Proutprout" + start_page_index, LOG_LEVEL.MSG);
        BitskinsFetcher.GetSingleton().populateDB(start_page_index, reason );
        console.log( BitskinsFetcher.GetSingleton().getPageIndex() );
    }
}
exports.PopulateDBCmd = PopulateDBCmd;