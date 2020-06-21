const assert                = require ('assert');
const Enum                  = require ('enum');

const Konst = rekwire ('/src/constants.js');
const konsole = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL = rekwire ('/src/bb_log.js').LOG_LEVEL;

class CMD_KONST
{
    static POPULATE_DB_ID = "POPULATE_DB_ID";
    static RESTORE_DB_ID = "RESTORE_DB_ID";
    static BACKUP_DB_ID = "BACKUP_DB_ID";

    static IDS = new Enum ([ CMD_KONST.POPULATE_DB_ID, CMD_KONST.RESTORE_DB_ID, CMD_KONST.BACKUP_DB_ID]);
}// CMD_KONST class


exports.CMD_KONST = CMD_KONST;
