"use strict";
const assert                = require ('assert');

const CommandRegistry       = rekwire ('/src/commands/command_registry.js').CommandRegistry;

const PopulateDBCmd         = rekwire ('/src/commands/populate_db_cmd.js').PopulateDBCmd;
const ProfitSelectSkinCmd   = rekwire ('/src/commands/profit_select_skin_cmd.js').ProfitSelectSkinCmd;
const BackupDBCmd           = rekwire ('/src/commands/backup_db_cmd.js').BackupDBCmd;
const RestoreDBCmd          = rekwire ('/src/commands/restore_db_cmd.js').RestoreDBCmd;

const CMD_KONST             = rekwire ('/src/commands/command_constants.js').CMD_KONST;


const BOOSTRAP_SINGLETON = "BOOSTRAP_SINGLETON";

class Boostrap
{
    
    static Instances = new Map();
    static Singleton = Boostrap.GetSingleton();
    
    constructor (args)
    {
        assert ( Boostrap.Instances.size <1) ; // Singleton Design Pattern
    }

    init = () =>
    {   console.log ("Coucou " + CMD_KONST.PROFIT_SLCT_SKIN_ID);
        CommandRegistry.GetSingleton().add( CMD_KONST.POPULATE_DB_ID, PopulateDBCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.RESTORE_DB_ID, RestoreDBCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.BACKUP_DB_ID, BackupDBCmd );
        CommandRegistry.GetSingleton().add( CMD_KONST.PROFIT_SLCT_SKIN_ID, ProfitSelectSkinCmd );
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