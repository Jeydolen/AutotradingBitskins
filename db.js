const mysql = require('mysql');
var MysqlDbConnection = null ;



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
}

const clearTables = () =>
{
    var db_query =   "TRUNCATE TABLE `bitskins_csgo`.`skin_sell_order` ;";
   executeQuery (db_query);
}

const connect = () =>
{
    var mysql_db_connection = mysql.createConnection
    (
        {
        host: "localhost",
        port: "3308",
        user: "rdp_admin",
        password: "UZ14xdQ7E",
        database: 'bitskins_csgo'
        }
    );
        mysql_db_connection.connect(function(err) 
        {
        if (err) throw err;
        console.log("Connected!");
        });
  
        MysqlDbConnection = mysql_db_connection;
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

exports.connect = connect;
exports.storeSkinSellOrder = storeSkinSellOrder;
exports.clearTables = clearTables;