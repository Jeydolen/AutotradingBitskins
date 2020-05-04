const timestamp = require ('time-stamp');
const exec = require('child_process').exec;
const mysql = require('mysql');
const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 

const sql_u            = require ('./sql_utilities.js');
const ColorConsole     = require ('./ColorConsole.js');



const DATA_PATH = './data/';
//const DATA_PATH = 'D:/Data/Github/AutotradingBitskins/data/';


const isRegistered = (db_name) => 
{
    if (db_name == undefined)
        db_name = sql_u.DB_NAME ;
    var is_registered = sql_u.registered_databases.hasOwnProperty (db_name);
    
    if (! is_registered)
    {
        MxI.$Log.write("Database " + db_name + "is not registered", ColorConsole.LOG_LEVEL.ERROR);
        return false;
    }
    return true;
};

const backupDB = () =>
{
    sql_u.connectSync ();
    if (! isRegistered ()) return Konst.RC.KO ;
    
    var now_time_stamp = timestamp('YYYY_MM_DD_HH_mm');
    var fullpath_to_sql_output_file = DATA_PATH + DB_NAME + '_' + now_time_stamp + '.sql';
    var child = exec(' mysqldump -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  DB_NAME + ' > ' + fullpath_to_sql_output_file);
    MxI.$Log.write('Backup succesfuly completed', ColorConsole.LOG_LEVEL.OK)
}; // backupDB ()


//-----------------------------------------------------
//--------------------  restoreDB  --------------------
//-----------------------------------------------------
const restoreDB = (file_path) =>
{
    sql_u.connectSync ();
    if (! isRegistered ()) return Konst.RC.KO ;
   
    var child = exec(' mysql -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  sql_u.DB_NAME + ' < ' + file_path);

    MxI.$Log.write('Restore succesfuly completed', ColorConsole.LOG_LEVEL.OK)
}; // restoreDB ()
//--------------------  restoreDB  --------------------


const clearTables = () =>
{   
    if (! isRegistered()) return Konst.RC.KO

    var db_query =   "TRUNCATE TABLE `" + sql_u.DB_NAME + "`.`skin_sell_order` ;";
    sql_u.executeQuery (sql_u.MysqlDbServer, db_query);

    db_query =   "TRUNCATE TABLE `" + sql_u.DB_NAME + "`.`skin` ;";
    sql_u.executeQuery (sql_u.MysqlDbServer, db_query);

   
    db_query =   "TRUNCATE TABLE `" + sql_u.DB_NAME + "`.`skin_set` ;";
    sql_u.executeQuery (sql_u.MysqlDbServer, db_query);

    
};

const getDBConnection = () =>
{
   return sql_u.MysqlDbServer;
};

exports.clearTables = clearTables ;
exports.backupDB = backupDB ;
exports.isRegistered = isRegistered ;
exports.restoreDB = restoreDB ;
exports.getDBConnection = getDBConnection ;