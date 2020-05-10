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

const DATA_PATH = './data/';

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
    var db = BB_Database.GetSingleton();
    konsole.log("db.clearTables() db: " + db.toString());

    //-------------------- DELETE `skin_sell_order` --------------------
    var query_txt =   "DELETE FROM `" + sql_u.DB_NAME + "`.`skin_sell_order` ;";
    var query_obj = BB_SqlQuery.Create(query_txt) ;
    query_obj.execute( db,  query_txt  )
    .then( rows => {
        konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
    } );

    //-------------------- DELETE `skin_sell_order` --------------------
    query_txt =   "DELETE FROM `" + sql_u.DB_NAME + "`.`skin` ;";
    query_obj.execute( db, query_txt )
    .then( rows => {
        konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
    } );

    //-------------------- DELETE `skin_set` --------------------
    query_txt =   "DELETE FROM `" + sql_u.DB_NAME + "`.`skin_set` ;";
    query_obj.execute(db , query_txt )
    .then( rows => {
        konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
    } );
}; // clearTables()

/*
const getDBConnection = () =>
{
   return sql_u.MysqlDbServer;
};*/


exports.clearTables = clearTables ;
exports.backupDB = backupDB ;
exports.restoreDB = restoreDB ;