const mysql = require ('mysql');
const async_npm = require ('async')
const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 

const ColorConsole     = require ('./ColorConsole.js');
const Konst = require ('./constants.js');

var isDBConnected = false;
var MysqlDbServer = null ;

const DB_NAME    = 'bitskins_csgo';
const ADMIN_NAME = "rdp_admin";
const ADMIN_PWD   = 'UZ14xdQ7E';
var registered_databases = {}
const CONNECTION_ARGS = 
{
    host: "localhost",
    port: "3308",
    user: ADMIN_NAME,
    password: ADMIN_PWD,
    database: DB_NAME
};

const SHOW_TABLES_QUERY = "SHOW TABLES ;"



const executeQuery = (db_connection, query) =>
{
    var sql_cmd = query.split(" ");
    var query = db_connection.query
    (   query, 
        function (error, results, fields) 
        {
            if (error)
            {
                MxI.$Log.write('Le probleme est ici ' + error +'\n' + query, ColorConsole.LOG_LEVEL.ERROR);
                return Konst.RC.KO;
            } 
            if (sql_cmd[0] != 'INSERT')
                MxI.$Log.write(sql_cmd[0] + ' completed with success', ColorConsole.LOG_LEVEL.OK);
            isDBConnected = true;
            return Konst.RC.OK;
        } 
    );
}; // executeQuery()


//-----------------------------------------------------------
const _connect = () =>
{   
    // https://stackoverflow.com/questions/32850045/node-js-synchronous-queries-with-mysql
    var mysql_db_server = mysql.createConnection( CONNECTION_ARGS);
    mysql_db_server.connect(function(err) 
    {
        if (err)
        {
            MxI.$Log.write("Affronte le lancement de WAMP", ColorConsole.LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        }
        MxI.$Log.write("Connected!", ColorConsole.LOG_LEVEL.OK);
    });
  
    MysqlDbServer = mysql_db_server;
    registered_databases [DB_NAME] = mysql_db_server;
    return mysql_db_server;
}; // _connect()
//-----------------------------------------------------------


//-----------------------------------------------------------
const connectSync = () =>
{   
    var mysql_db_connection = null;

    async_npm.until( 
        // Condition de sortie
        function test(cb) 
        {
           cb(null, isDBConnected)
        },
    
        // Boucle tant que Condition de sortie non remplie
        function iter(cb) 
        {
           mysql_db_connection = _connect();
           var rc = executeQuery(mysql_db_connection, SHOW_TABLES_QUERY);
           console.log("connectSync ...");
        },
    
        // End
        // Exécuté en sortie de boucle
        function (err) 
        {
          // All things are done!
          console.log("connectSync Succcessful !!");
         }
      ); // async.whilst()
}; // connectSync(à)
//-----------------------------------------------------------
const test = () =>
{
    connectSync()
    return 0;
}
test();


exports.executeQuery = executeQuery ;
exports.connectSync = connectSync ;
exports.DB_NAME = DB_NAME ;
exports.registered_databases = registered_databases ;
exports.MysqlDbServer = MysqlDbServer ;