const timestamp = require ('time-stamp');
const exec = require('child_process').exec;
const mysql = require('mysql');

var MysqlDbConnection = null ;
var connected_databases = {}

const DATA_PATH = 'D:/Data/Github/AutotradingBitskins/data/';
const DB_NAME    = 'bitskins_csgo';
const ADMIN_NAME = "rdp_admin";
const ADMIN_PWD   = 'UZ14xdQ7E';



const isConnected = (db_name) => 
{
    return (connected_databases.hasOwnProperty (db_name));
};

const backupDB = () =>
{
    connect ();
    if (! isConnected (DB_NAME))
    {
        console.log("Database " + DB_NAME + "is not connected");
        return -1 ;
    }
    var now_time_stamp = timestamp('YYYY_MM_DD_HH_mm');
    var fullpath_to_sql_output_file = DATA_PATH + DB_NAME + '_' + now_time_stamp + '.sql';
    var child = exec(' mysqldump -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  DB_NAME + ' > ' + fullpath_to_sql_output_file);
    console.log ('Backup succesfuly completed')
}; // backupDB ()

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

const executeQuery = (query) =>
{
    var sql_cmd = query.split(" ");
    var query = MysqlDbConnection.query
    ( query, 
    function (error, results, fields) 
    {
    if (error) throw error;
    console.log(sql_cmd[0] + ' completed with success');
        }
    );
};

const clearTables = () =>
{
    var db_query =   "TRUNCATE TABLE `" + DB_NAME + "`.`skin_sell_order` ;";
   executeQuery (db_query);
};

const connect = () =>
{
    var mysql_db_connection = mysql.createConnection
    (
        {
        host: "localhost",
        port: "3308",
        user: ADMIN_NAME,
        password: ADMIN_PWD,
        database: DB_NAME
        }
    );
        mysql_db_connection.connect(function(err) 
        {
        if (err) throw err;
        console.log("Connected!");
        });
  
        MysqlDbConnection = mysql_db_connection;
        connected_databases [DB_NAME] = mysql_db_connection;
};

const storeSkinSellOrder = (skin_sell_order) =>
{
    if (skin_sell_order.sell_order_id_str == undefined)
    {
        console.log ('Mysql erro skin_sell_order.sell_order_id: ' + skin_sell_order.sell_order_id_str);
        return 0;
    } 

    var store_sell_order_query =   "INSERT INTO `skin_sell_order` (`sell_order_id_str`,`skin_state`) "
                        + "VALUES ( '"
                        +  skin_sell_order.sell_order_id_str +"',"
                        +  skin_sell_order.state
                        + "  );";

    executeQuery (store_sell_order_query);
};

exports.connect = connect ;
exports.storeSkinSellOrder = storeSkinSellOrder ;
exports.clearTables = clearTables ;
exports.backupDB = backupDB ;
exports.isConnected = isConnected ;
exports.restoreDB = restoreDB ;