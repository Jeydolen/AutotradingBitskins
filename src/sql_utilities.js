const mysql     = require ('mysql');
const async_npm = require ('async');
const MxI       = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const Enum      = require('enum');

const ColorConsole  = require ('./ColorConsole.js');
const Konst         = require ('./constants.js');

var isDBConnected = false;
var MysqlDbServer = null ;

const DB_NAME     = 'bitskins_csgo';
const ADMIN_NAME  = "rdp_admin";
const ADMIN_PWD   = 'UZ14xdQ7E';

var registered_databases = {}

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

//---------------------------------------------------------------------------
//------------------------------  BB_SqlQuery  ------------------------------
//---------------------------------------------------------------------------
class BB_SqlQuery 
{
    //           requis  requis     requis
    constructor( bb_db, cmd_type, query_text ) 
    {
        MxI.$Log.write("BB_SqlQuery constructor", ColorConsole.LOG_LEVEL.MSG);
        this.bb_db      = bb_db;
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

    execute( query_text, args )
    {   
        MxI.$Log.write("BB_SqlQuery execute()", ColorConsole.LOG_LEVEL.MSG);

        if ( this.cmd_type == CMD_TYPE.NOTHING )
        { 
            MxI.$Log.write("BB_SqlQuery execute() Affronte les arabes !!", ColorConsole.LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        }

        if ( query_text != undefined )
        {
            var cmd_type = _getCmdType(query_text);
            if (cmd_type != CMD_TYPE.NOTHING)
            {
                this.cmd_type = cmd_type;
                this.query_text = query_text;
            } 
        }
        
        MxI.$Log.write("BB_SqlQuery execute(): send to MySql server", ColorConsole.LOG_LEVEL.MSG);

        return 0;

        return new Promise
            ( 
                ( resolve, reject ) => 
                {
                    //========== QUERY ==========
                    this.bb_db.getConnection().query
                    (   
                        this.query_text, 
                        args, 

                        ( err, rows ) => 
                        {
                            if ( err )
                            {
                                MxI.$Log.write("BB_SqlQuery execute(): \n" + err , ColorConsole.LOG_LEVEL.ERROR);
                                return reject( err );
                            }
                                
                            resolve( rows );
                        } 
                    )
                    //========== QUERY
                } 
            );
    } // execute()  

    //            requis     requis                optionnel
    //                    ex: "SELECT * FROM ..."     []
    static Create( bb_db,   query_text    ,         tables ) 
    {
        MxI.$Log.write("BB_SqlQuery.Create()", ColorConsole.LOG_LEVEL.MSG);

        if (BB_SqlQuery.NULL_QUERY == undefined)
            BB_SqlQuery.NULL_QUERY = new BB_SqlQuery(null, Konst.NOTHING);

        if ( query_text == undefined || bb_db == undefined)
            return BB_SqlQuery.NULL_QUERY;

        var cmd_type = BB_SqlQuery._ExtractCmdType( query_text );
        if (cmd_type != CMD_TYPE.NOTHING)
               return new BB_SqlQuery( bb_db, cmd_type, query_text );
              
        return BB_SqlQuery.NULL_QUERY;   
    } // Create()  

    static GetNullObject() 
    {
        this.as_text = "NOTHING";
        if (BB_SqlQuery.NULL_QUERY == undefined)
            BB_SqlQuery.NULL_QUERY = new BB_SqlQuery(null, Konst.NOTHING);
        return BB_SqlQuery.NULL_QUERY;
    } // GetNullObject()  

    toString()
    {
        return this.as_text;
    } // GetNullObject()  

    getCommandType()
    {
        return this.cmd_type.toString();
    } // getCommand()  
} // BB_SqlQuery class
BB_SqlQuery.NULL_QUERY;
BB_SqlQuery.CLEAR_TABLES;
//------------------------------  BB_SqlQuery



//---------------------------------------------------------------------------
//------------------------------  BB_Database  ------------------------------
//---------------------------------------------------------------------------
class BB_Database 
{
    constructor( connection_args ) 
    {
        MxI.$Log.write("BB_Database constructor", ColorConsole.LOG_LEVEL.MSG);
        if (connection_args == undefined) connection_args = CONNECTION_ARGS ;
        this.connection = mysql.createConnection( connection_args );
        this.query = BB_SqlQuery.GetNullObject();
    } // constructor

    getConnection() 
    {
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

    static Create( connection_args ) 
    {
        MxI.$Log.write("BB_Database.Create()", ColorConsole.LOG_LEVEL.MSG);

        if (this.connection_args  == undefined) 
            connection_args = CONNECTION_ARGS ;

        var bb_db = new BB_Database(connection_args) ;

       return bb_db;
    } // Create()  
} // BB_Database class
//------------------------------  BB_Database



const executeQuery = (db_connection, query, cb) =>
{
    console.log("executeQuery()  query:" + query);

    var sql_query_words = query.split(" ");
    var sql_cmd = sql_query_words[0];

    console.log("executeQuery()  sql_cmd:" + sql_cmd);

    const executeQuery_default_cb = (error, results, fields) =>
    {
        console.log("executeQuery_default_cb: ");
        if (error)
        {
            MxI.$Log.write('Le probleme est ici ' + error +'\n' + query, ColorConsole.LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        } 

        if (sql_cmd != 'INSERT')
            MxI.$Log.write(sql_cmd + ' completed with success', ColorConsole.LOG_LEVEL.OK);
       
        if (sql_cmd == 'SELECT')
        {
           /* console.log("executeQuery results: " + JSON.stringify(results));
            console.log("executeQuery results: " + results.length);
            console.log("executeQuery cb(SELECT)"); */
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
    var query = db_connection.query( query, cb );
    //============================== QUERY ==============================
}; // executeQuery()


//-----------------------------------------------------------
const _connect = () =>
{   
    // https://stackoverflow.com/questions/32850045/node-js-synchronous-queries-with-mysql
    var mysql_db_server = mysql.createConnection(CONNECTION_ARGS);
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
    connectSync()
    return 0;
} // testconnectSync

//-----------------------------------------------------------
const run_BB_DB_UT = () =>
{
    var bb_db = BB_Database.Create();
    var query = BB_SqlQuery.Create(bb_db, "SHOW TABLE ;");
    query.execute();
    return 0;
} // testBB_DB

//-----------------------------------------------------------
const runUnitTests = () =>
{
    MxI.$Log.write("runUnitTests()", ColorConsole.LOG_LEVEL.MSG);
    // run_connectSync_UT()
    run_BB_DB_UT()
    return 0;
} // runUnitTests

runUnitTests();


exports.executeQuery = executeQuery ;
exports.connectSync = connectSync ;
exports.DB_NAME = DB_NAME ;
exports.registered_databases = registered_databases ;
exports.MysqlDbServer = MysqlDbServer ;