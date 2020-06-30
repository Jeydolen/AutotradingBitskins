const assert                = require ('assert');
const { ShowDevToolsCmd } = require('./commands/show_dev_tools_cmd');

const CommandRegistry       = rekwire ('/src/commands/command_registry.js').CommandRegistry;
const Singleton             = rekwire ('/src/singleton.js').Singleton;
const PopulateDBCmd         = rekwire ('/src/commands/populate_db_cmd.js').PopulateDBCmd;
const ProfitSelectSkinCmd   = rekwire ('/src/commands/profit_select_skin_cmd.js').ProfitSelectSkinCmd;
const BackupDBCmd           = rekwire ('/src/commands/backup_db_cmd.js').BackupDBCmd;
const RestoreDBCmd          = rekwire ('/src/commands/restore_db_cmd.js').RestoreDBCmd;
const CMD_KONST             = rekwire ('/src/commands/command_constants.js').CMD_KONST;

class Boostrap extends Singleton
{
    
    static Instances = new Map();
    static Singleton = Boostrap.GetSingleton();
    
    constructor (args)
    {
        super ( args );
        assert ( Boostrap.Instances.size <1) ; // Singleton Design Pattern
    }

    init = () =>
    {   console.log ("Coucou " + CMD_KONST.PROFIT_SLCT_SKIN_ID);
        CommandRegistry.GetSingleton().add( CMD_KONST.POPULATE_DB_ID, PopulateDBCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.RESTORE_DB_ID, RestoreDBCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.BACKUP_DB_ID, BackupDBCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.PROFIT_SLCT_SKIN_ID, ProfitSelectSkinCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.SHOW_DEV_TOOLS_ID, ShowDevToolsCmd );
    }
}
exports.Boostrap = Boostrap;