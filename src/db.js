const timestamp = require ('time-stamp');
const exec      = require('child_process').exec;
const mysql     = require('mysql');
const MxI       = require('mixin-interface-api/src/mixin_interface_api.js').MxI;
const async_npm = require ('async');

const sql_u    = require ('./sql_utilities.js');
const ColorConsole     = require ('./ColorConsole.js');
const Konst            = require ('./constants.js');



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


//-----------------------------------------------------
//--------------------  SelectInDB  -------------------
//-----------------------------------------------------
const executeQuery_SelectInDB_cb = (error, results, fields) =>
{
        console.log("executeQuery_SelectInDB_cb()");
        if (error)
        {
            MxI.$Log.write('Le probleme est ici ' + error +'\n' + query, ColorConsole.LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        } 

        MxI.$Log.write(' completed with success', ColorConsole.LOG_LEVEL.OK);
       
        // console.log("executeQuery results: " + JSON.stringify(results));
        console.log("executeQuery results: " + results.length);
        //console.log("executeQuery cb(SELECT)"); 
        return results;
        //return Konst.RC.OK; 
}; // executeQuery_SelectInDB_cb(')

const SelectInDB = (table, fields) =>
{
    sql_u.connectSync ();
    if (! isRegistered ()) return Konst.RC.KO ;
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

    var db_query =   "DELETE FROM `" + sql_u.DB_NAME + "`.`skin_sell_order` ;";
    sql_u.executeQuery (sql_u.MysqlDbServer, db_query);

    db_query =   "DELETE FROM `" + sql_u.DB_NAME + "`.`skin` ;";
    sql_u.executeQuery (sql_u.MysqlDbServer, db_query);

   
    db_query =   "DELETE FROM `" + sql_u.DB_NAME + "`.`skin_set` ;";
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
exports.SelectInDB = SelectInDB ;