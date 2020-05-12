const mysql     = require ('mysql');
const async_npm = require ('async');
const MxI       = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const Enum      = require('enum');
const assert     = require('assert');


const Konst         = require ('./constants.js');
const bb_log        = require ('./bb_log.js'); 
const konsole       = require ('./bb_log.js').konsole;
const LOG_LEVEL     = require ('./bb_log.js').LOG_LEVEL;

var isDBConnected = false;
var MysqlDbServer = null ;


var registered_databases = {};






//MxI.$Log.write("sql_utilities: class declarations"); 
console.log(" C'est quoi ce bordel ?");



//-----------------------------------------------------------
const _connect = () =>
{   
    // https://stackoverflow.com/questions/32850045/node-js-synchronous-queries-with-mysql
    var mysql_db_server = mysql.createConnection(CONNECTION_ARGS);
    mysql_db_server.connect(function(err) 
    {
        if (err)
        {
            MxI.$Log.write("Affronte le lancement de WAMP", LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        }
        MxI.$Log.write("Connected!", LOG_LEVEL.OK);
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
const run_connectSync_UT = () =>
{
    connectSync();
    return 0;
} // testconnectSync

//-----------------------------------------------------------
const run_BB_DB_UT = ( table, fields ) =>
{
    MxI.$Log.write("sql_utilities: run_BB_DB_UT()", LOG_LEVEL.MSG);
    var bb_db = BB_Database.Create();
    var query_obj = BB_SqlQuery.Create(bb_db, "SHOW TABLE ;");

    if (table == undefined || table == '' ) return Konst.RC.KO;

    var table_str = '`' + table + '`';

    var fields_str = '*';
    if (fields != undefined ) 
    { 
        var fields_str = ' ';
        if (typeof fields === 'string' || fields instanceof String)
            fields = [ fields];

        var count  = 0;
        var suffix = '';
        for (var i=0; i < fields.length; i++)
        {
            konsole.log("iter count " + count);
            suffix = ' , ';
            if ( (count + 1) == fields.length) suffix = '';
            var field = fields[i];
            fields_str = fields_str + '`' + field + '` ' + suffix;
            count++;
        }
    }

    var query_str =  'SELECT ' + fields_str + ' FROM ' + table_str + ' ; ';
    MxI.$Log.write("run_BB_DB_UT: query_str: \n " + query_str, LOG_LEVEL.INFO);
    MxI.$Log.write("run_BB_DB_UT: KéKOnFé main nan ?", LOG_LEVEL.MSG);

    query_obj.execute( query_str )
    .then( rows => {
        // do something with the result
        MxI.$Log.write("run_BB_DB_UT: KéKOnFé main nan ?", LOG_LEVEL.MSG);
        for (var i=0; i < rows.length; i++)
        {
            //var msg = JSON.stringify(rows[i]);
            var msg = rows[i]['name'];
            MxI.$Log.write(msg , LOG_LEVEL.INFO);
        }
    } );
    return 0;
} // testBB_DB

//-----------------------------------------------------------
const runUnitTests = () =>
{
    MxI.$Log.write("runUnitTests()", LOG_LEVEL.MSG);
    // run_connectSync_UT()
    run_BB_DB_UT( 'skin', 'name');
    return 0;
} // runUnitTests


//MxI.$Log.write("sql_utilities: runUnitTests()", LOG_LEVEL.MSG);
//runUnitTests();


//exports.executeQuery = executeQuery ;
exports.connectSync = connectSync ;
exports.registered_databases = registered_databases ;
exports.MysqlDbServer = MysqlDbServer ;
