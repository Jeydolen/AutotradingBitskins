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

const DB_NAME     = 'bitskins_csgo';
const ADMIN_NAME  = "rdp_admin";
const ADMIN_PWD   = 'UZ14xdQ7E';

var registered_databases = {};

const CONNECTION_ARGS = 
{
    host: "localhost",
    port: "3308",
    user: ADMIN_NAME,
    password: ADMIN_PWD,
    database: DB_NAME
}; // CONNECTION_ARGS

const CMD_TYPE = new Enum (['NOTHING', 'DELETE', 'SHOW', 'INSERT', 'SELECT']);

const SHOW_TABLES_QUERY = "SHOW TABLES ;"


//MxI.$Log.write("sql_utilities: class declarations"); 
console.log(" C'est quoi ce bordel ?");

//---------------------------------------------------------------------------
//------------------------------  BB_SqlQuery  ------------------------------
//---------------------------------------------------------------------------
// https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
class BB_SqlQuery 
{
    //            requis     requis
    constructor( cmd_type, query_text ) 
    {
        //MxI.$Log.write("BB_SqlQuery constructor", LOG_LEVEL.MSG);
        konsole.log("BB_SqlQuery constructor ");

        this.cmd_type   = cmd_type;
        this.query_text = query_text;
    } // constructor  

    _setQueryText( query_text )
    {
        this.query_text = query_text;
    } // GetNullObject()

    //                       requis
    static _ExtractCmdType( query_text )
    {
        var cmd_type = CMD_TYPE.NOTHING;
        if (query_text == undefined || query_text == '')
            return cmd_type;

        var query_as_words = query_text.split(' ');
        if (query_as_words.length > 0)
        {
            var first_word = query_as_words[0];
            // if (a==1)           (a==1) ?
            //    return "OK"         "OK" :
            // else
            //    return "KO";        "KO"
            cmd_type = 
                ( first_word == 'DELETE' ? CMD_TYPE.DELETE  :
                  first_word == 'INSERT' ? CMD_TYPE.INSERT :
                  first_word == 'SELECT' ? CMD_TYPE.SELECT :
                  first_word == 'SHOW'   ? CMD_TYPE.SHOW :
                  CMD_TYPE.NOTHING
                );
        }
        return cmd_type;
    } // _ExtractCmdType()

    //       requis
    execute( db_obj, query_text, args )
    {   
        assert(db_obj != undefined); 

        konsole.log("BB_SqlQuery execute()", LOG_LEVEL.MSG);
        konsole.log("query: " + this.query_text, LOG_LEVEL.MSG);

        if ( this.cmd_type == CMD_TYPE.NOTHING )
        { 
            MxI.$Log.write("BB_SqlQuery execute() Affronte les arabes !!", LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        }

        if ( query_text != undefined )
        {
            var cmd_type = BB_SqlQuery._ExtractCmdType(query_text);
            if (cmd_type != CMD_TYPE.NOTHING)
            {
                this.cmd_type = cmd_type;
                this.query_text = query_text;
            } 
        }
        
        konsole.log("BB_SqlQuery execute(): send to MySql server", LOG_LEVEL.MSG);
        konsole.log("db_obj: " + db_obj);
         
        /*
        if (this.db_obj.getConnection() == null)
        {

            return new Promise
            ( 
                ( resolve, reject ) => 
                {
                    konsole.log("BB_SqlQuery.execute() db_obj.GetConnection() is undefined", LOG_LEVEL.ERROR);
                } 
            );
        }*/

        //konsole.log("BB_SqlQuery.execute() db_obj: ", db_obj);
        //konsole.log("BB_SqlQuery.execute() typeof db_obj: ", typeof(db_obj));

        /*
        var db_connection = this.db_obj.getConnection();
        return new Promise
        ( 
            ( resolve, reject ) => 
            {
                konsole.log("BB_SqlQuery.execute() TEST", LOG_LEVEL.ERROR);
            } 
        );
        */


        return new Promise
            ( 
                ( resolve, reject ) => 
                {
                    //========== QUERY ==========
                    db_obj.getConnection().query
                    (   
                        this.query_text, 
                        args, 

                        ( err, rows ) => 
                        {
                            if ( err )
                            {
                                MxI.$Log.write("BB_SqlQuery execute(): \n" + err , LOG_LEVEL.ERROR);
                                return reject( err );
                            }
                                
                            resolve( rows );
                        } 
                    )
                    //========== QUERY
                } 
            );
    } // execute()  

    //               requis                optionnel
    //           ex: "SELECT * FROM ..."     []
    static Create( query_text    ,         tables ) 
    {
        konsole.log("BB_SqlQuery.Create()", LOG_LEVEL.MSG);
        assert( query_text != undefined );

        var cmd_type = BB_SqlQuery._ExtractCmdType( query_text );

        var new_query = BB_SqlQuery.GetNullObject();
        if (cmd_type != CMD_TYPE.NOTHING)
        {
            konsole.log("cmd_type : " + cmd_type);
            new_query = new BB_SqlQuery( cmd_type, query_text );
        }
        else
        {
            konsole.log("cmd_type is NOTHING " + cmd_type, LOG_LEVEL.ERROR);
        }
            
              
        return new_query;   
    } // Create()  

    static GetNullObject() 
    {
        if (BB_SqlQuery.NULL_QUERY == undefined)
            BB_SqlQuery.NULL_QUERY = new BB_SqlQuery( "NULL_QUERY");
        return BB_SqlQuery.NULL_QUERY;
    } // GetNullObject()  

    toString()
    {
        return this.as_text;
    } // GetNullObject()  

    getCommand()
    {
        return this.cmd_type.toString();
    } // getCommand()  
} // BB_SqlQuery class
BB_SqlQuery.NULL_QUERY;
BB_SqlQuery.CLEAR_TABLES;
exports.BB_SqlQuery = BB_SqlQuery;
//------------------------------  BB_SqlQuery


//---------------------------------------------------------------------------
//------------------------------  BB_Database  ------------------------------
//---------------------------------------------------------------------------
class BB_Database 
{
    constructor( connection_args ) 
    {
        konsole.log(">> ---- BB_Database constructor", LOG_LEVEL.MSG);
        if (connection_args == undefined) connection_args = CONNECTION_ARGS ;
        this.connection = mysql.createConnection( connection_args );
    } // constructor

    getConnection() 
    {
        konsole.log("BB_Database.getConnection() this.connection " + this.connection, LOG_LEVEL.MSG)
        return this.connection;
    }

    close() 
    {
        return new Promise( ( resolve, reject ) => 
        {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }

    static GetSingleton(connection_args)
    {
        konsole.log("BB_Database.GetSingleton() BB_Database.Singleton: " + BB_Database.Singleton);
        if (connection_args  == undefined) 
            connection_args = CONNECTION_ARGS ;

        if (BB_Database.Singleton == undefined)
            BB_Database.Singleton = new BB_Database(connection_args) ;
        return BB_Database.Singleton;
    } // GetSingleton()

    static Create( connection_args ) 
    {
       return  BB_Database.GetSingleton();
    } // Create()  
} // BB_Database class
BB_Database.Singleton;
exports.BB_Database = BB_Database ;
//------------------------------  BB_Database


/*
const executeQuery = (db_connection, query, cb) =>
{
    console.log("executeQuery()  query:" + query);

    var sql_query_words = query.split(" ");
    var sql_cmd = sql_query_words[0];

    konsole.log("executeQuery()  sql_cmd:" + sql_cmd, LOG_LEVEL.MSG);

    const executeQuery_default_cb = (error, results, fields) =>
    {
        //console.log("executeQuery_default_cb: ");
        if (error)
        {
            MxI.$Log.write('Le probleme est ici ' + error +'\n' + query, LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        } 

        if (sql_cmd != 'INSERT')
            MxI.$Log.write(sql_cmd + ' completed with success', LOG_LEVEL.OK);
       
        if (sql_cmd == 'SELECT')
        {
            console.log("executeQuery results: " + JSON.stringify(results));
            console.log("executeQuery results: " + results.length);
            console.log("executeQuery cb(SELECT)"); 
            return results;
        } 
        return Konst.RC.OK; 
    }; // executeQuery_default_cb()

    if (cb == undefined) 
    {
        console.log("cb was undefined");
        cb = executeQuery_default_cb;
    }

    console.log("executeQuery()  cb: " + cb.name + "()");

    //============================== QUERY ==============================
    var query = MysqlDbServer.query( query, cb );
    //============================== QUERY ==============================
}; // executeQuery()
*/


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
exports.DB_NAME = DB_NAME ;
exports.registered_databases = registered_databases ;
exports.MysqlDbServer = MysqlDbServer ;
