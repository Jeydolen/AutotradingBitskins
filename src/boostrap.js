const assert                = require ('assert');

const ShowDevToolsCmd       = rekwire('/src/commands/show_dev_tools_cmd').ShowDevToolsCmd;
const CommandRegistry       = rekwire ('/src/commands/command_registry.js').CommandRegistry;
const Singleton             = rekwire ('/src/singleton.js').Singleton;
const PopulateDBCmd         = rekwire ('/src/commands/populate_db_cmd.js').PopulateDBCmd;
const ProfitSelectSkinCmd   = rekwire ('/src/commands/profit_select_skin_cmd.js').ProfitSelectSkinCmd;
const BackupDBCmd           = rekwire ('/src/commands/backup_db_cmd.js').BackupDBCmd;
const RestoreDBCmd          = rekwire ('/src/commands/restore_db_cmd.js').RestoreDBCmd;
const SubmitValueCmd        = rekwire ('/src/commands/submit_value_cmd.js').SubmitValueCmd;
const CMD_KONST             = rekwire ('/src/commands/command_constants.js').CMD_KONST;

class Boostrap extends Singleton
{
    static Singleton = Boostrap.GetSingleton();
    
    constructor (args)
    {
        super ( args );
    }

    init = () =>
    {
        CommandRegistry.GetSingleton().add( CMD_KONST.SUBMIT_VALUE_ID, SubmitValueCmd);
        CommandRegistry.GetSingleton().add( CMD_KONST.POPULATE_DB_ID, PopulateDBCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.RESTORE_DB_ID, RestoreDBCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.BACKUP_DB_ID, BackupDBCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.PROFIT_SLCT_SKIN_ID, ProfitSelectSkinCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.SHOW_DEV_TOOLS_ID, ShowDevToolsCmd );
    }
}
exports.Boostrap = Boostrap;