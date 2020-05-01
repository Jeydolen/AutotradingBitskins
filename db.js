const timestamp = require ('time-stamp');
const exec = require('child_process').exec;
const mysql = require('mysql');


const sql_u = require ('./sql_utilities.js');



const DATA_PATH = './data/';
//const DATA_PATH = 'D:/Data/Github/AutotradingBitskins/data/';




const isRegistered = (db_name) => 
{
    return (registered_databases.hasOwnProperty (db_name));
};

const backupDB = () =>
{
    connect ();
    if (! isRegistered (DB_NAME))
    {
        console.log("Database " + DB_NAME + "is not connected");
        return -1 ;
    }
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
    connect ();
    if (! isConnected (DB_NAME))
    {
        console.log("Database " + DB_NAME + "is not connected");
        return -1 ;
    }
    var child = exec(' mysql -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  DB_NAME + ' < ' + file_path);
    console.log ('Restore succesfuly completed')
}; // restoreDB ()
//--------------------  restoreDB  --------------------


const clearTables = () =>
{
    var db_query =   "TRUNCATE TABLE `" + DB_NAME + "`.`skin_sell_order` ;";
    sql_u.executeQuery (MysqlDbConnection, db_query);
};

const getDBConnection = () =>
{
   return MysqlDbConnection;
};

exports.connect = connect ;
exports.clearTables = clearTables ;
exports.backupDB = backupDB ;
exports.isRegistered = isRegistered ;
exports.restoreDB = restoreDB ;
exports.getDBConnection = getDBConnection ;