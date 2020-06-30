const assert                = require ('assert');
const Enum                  = require ('enum');

const Konst = rekwire ('/src/constants.js');
const konsole = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL = rekwire ('/src/bb_log.js').LOG_LEVEL;

class CMD_KONST
{
    
    static POPULATE_DB_ID       = "POPULATE_DB_ID";
    static RESTORE_DB_ID        = "RESTORE_DB_ID";
    static BACKUP_DB_ID         = "BACKUP_DB_ID";
    static PROFIT_SLCT_SKIN_ID  = "PROFIT_SLCT_SKIN_ID";
    static SHOW_DEV_TOOLS_ID    = "SHOW_DEV_TOOLS_ID";

    static CheckProfitableSkinCmdObj = class
    {
       constructor (skin_set_value, item_state_value, skin_rarity_value)
        {
            this.skin_set_value     = skin_set_value; 
            this.item_state_value   = item_state_value; 
            this.skin_rarity_value  = skin_rarity_value;
        }
    }; // CheckProfitableSkinCmdObj klass
    
    static ID = new Enum ([ CMD_KONST.POPULATE_DB_ID, CMD_KONST.RESTORE_DB_ID, CMD_KONST.BACKUP_DB_ID, 
                            CMD_KONST.PROFIT_SLCT_SKIN_ID, CMD_KONST.SHOW_DEV_TOOLS_ID ]);
    static CMD_ARGS  = { PROFIT_SLCT_SKIN_ID : CMD_KONST.CheckProfitableSkinCmdObj };
    
}// CMD_KONST class


exports.CMD_KONST = CMD_KONST;
