const timestamp = require ('time-stamp');
const exec = require('child_process').exec;
const mysql = require('mysql');


const sql_u = require ('./sql_utilities.js');



const DATA_PATH = './data/';
//const DATA_PATH = 'D:/Data/Github/AutotradingBitskins/data/';


const isRegistered = (db_name) => 
{
    if (db_name == undefined)
        db_name = sql_u.DB_NAME ;
    var is_registered = sql_u.registered_databases.hasOwnProperty (db_name);
    
    if (! is_registered)
    {
        console.log("Database " + db_name + "is not registered");
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
    console.log ('Backup succesfuly completed')
}; // backupDB ()


//-----------------------------------------------------
//--------------------  restoreDB  --------------------
//-----------------------------------------------------
const restoreDB = (file_path) =>
{
    sql_u.connectSync ();
    if (! isRegistered ()) return Konst.RC.KO ;
   
    var child = exec(' mysql -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  sql_u.DB_NAME + ' < ' + file_path);
    console.log ('Restore succesfuly completed')
}; // restoreDB ()
//--------------------  restoreDB  --------------------


const clearTables = () =>
{   
    if (! isRegistered()) return Konst.RC.KO

    var db_query =   "TRUNCATE TABLE `" + sql_u.DB_NAME + "`.`skin_sell_order` ;";
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