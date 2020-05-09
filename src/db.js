const timestamp = require ('time-stamp');
const exec      = require('child_process').exec;
const mysql     = require('mysql');
const MxI       = require('mixin-interface-api/src/mixin_interface_api.js').MxI;
const async_npm = require ('async');

const sql_u        = require ('./sql_utilities.js');
const konsole      = require('./bb_log.js').konsole;
const LOG_LEVEL    = require('./bb_log.js').LOG_LEVEL;
const ColorConsole = require('./bb_log.js').ColorConsole;
const FileLogger   = require('./bb_log.js').FileLogger;
const BB_Database  = require('./sql_utilities.js').BB_Database;
const BB_SqlQuery  = require('./sql_utilities.js').BB_SqlQuery;
const Konst        = require ('./constants.js');

/*
var color_logger = new ColorConsole();
MxI.$Log.addSink(color_logger);

var file_logger = new FileLogger("../data/log/log_"+ timestamp('YYYY_MM_DD_HH_mm') + '.txt');
MxI.$Log.addSink(file_logger)
*/

const DATA_PATH = './data/';

var Bitskin_DB = BB_Database.Create(Konst.Nothing);
//const DATA_PATH = 'D:/Data/Github/AutotradingBitskins/data/';

const GetCurrentDB = () =>
{
    return Bitskin_DB;
}


//-----------------------------------------------------
//--------------------  SelectInDB  -------------------
//-----------------------------------------------------
const executeQuery_SelectInDB_cb = (error, results, fields) =>
{
        console.log("executeQuery_SelectInDB_cb()");
        if (error)
        {
            MxI.$Log.write('Le probleme est ici ' + error +'\n' + query, LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        } 

        MxI.$Log.write(' completed with success', LOG_LEVEL.OK);
       
        // console.log("executeQuery results: " + JSON.stringify(results));
        console.log("executeQuery results: " + results.length);
        //console.log("executeQuery cb(SELECT)"); 
        return results;
        //return Konst.RC.OK; 
}; // executeQuery_SelectInDB_cb(')


const SelectInDB = (table, fields) =>
{
    sql_u.connectSync ();
    if (! BB_Database.IsRegistered ()) return Konst.RC.KO ;

    if (fields == undefined || fields.length == 0) fields = '*';
    if (table == undefined ) table = 'skin_set';

    var db_query = "SELECT " + fields + " FROM `" + table + "` ;";
    MxI.$Log.write (db_query);
    
    var results = undefined

    results = sql_u.executeQuery (sql_u.MysqlDbServer, db_query, executeQuery_SelectInDB_cb);


    if (results == undefined) 
        return Konst.RC.KO
    else  
        console.log ("Result test () : " + JSON.stringify(results));

     /*
    async_npm.until( 
        function test(cb) 
        {
            console.log ("Result test () : " + JSON.stringify(result));
            var exit_condition = false ;
            cb(null, (exit_condition)); 
            
        },
    
        function iter(cb) 
        {

          console.log ("Result iter () : " + JSON.stringify(result));
          result = sql_u.executeQuery (sql_u.MysqlDbServer, db_query);
          
        },
    
        // End
        function (err) 
        {
          // All things are done!
          console.log ("Saucisse")
          MxI.$Log.write("Select result : " + JSON.stringify(result), ColorConsole.LOG_LEVEL.MSG);
         }
      ); // async.whilst()
      */
}; // SelectInDB()
//--------------------  SelectInDB

const backupDB = () =>
{
    sql_u.connectSync ();
    if (! BB_Database.IsRegistered ()) return Konst.RC.KO ;
    
    var now_time_stamp = timestamp('YYYY_MM_DD_HH_mm');
    var fullpath_to_sql_output_file = DATA_PATH + DB_NAME + '_' + now_time_stamp + '.sql';
    var child = exec(' mysqldump -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  DB_NAME + ' > ' + fullpath_to_sql_output_file);
    MxI.$Log.write('Backup succesfuly completed', LOG_LEVEL.OK)
}; // backupDB ()


//-----------------------------------------------------
//--------------------  restoreDB  --------------------
//-----------------------------------------------------
const restoreDB = (file_path) =>
{
    sql_u.connectSync ();
    if (! BB_Database.IsRegistered ()) return Konst.RC.KO ;
   
    var child = exec(' mysql -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  sql_u.DB_NAME + ' < ' + file_path);

    MxI.$Log.write('Restore succesfuly completed', LOG_LEVEL.OK)
}; // restoreDB ()
//--------------------  restoreDB  --------------------


const clearTables = () =>
{   
    //if (! BB_Database.IsRegistered()) sql_u.connectSync();
    if (! BB_Database.IsRegistered()) 
        Bitskin_DB = BB_Database.Create();

    var query_txt =   "DELETE FROM `" + sql_u.DB_NAME + "`.`skin_sell_order` ;";
    var query_obj = BB_SqlQuery.Create( Bitskin_DB, query_txt );
    query_obj.execute( )
    .then( rows => {
        konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
    } );

    query_txt =   "DELETE FROM `" + sql_u.DB_NAME + "`.`skin` ;";
    query_obj.execute(query_txt )
    .then( rows => {
        konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
    } );

    query_txt =   "DELETE FROM `" + sql_u.DB_NAME + "`.`skin_set` ;";
    query_obj.execute(query_txt )
    .then( rows => {
        konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
    } );
}; // clearTables()

const getDBConnection = () =>
{
   return sql_u.MysqlDbServer;
};


exports.clearTables = clearTables ;
exports.backupDB = backupDB ;
exports.restoreDB = restoreDB ;
exports.getDBConnection = getDBConnection ;
exports.SelectInDB = SelectInDB ;
exports.GetCurrentDB = GetCurrentDB ;