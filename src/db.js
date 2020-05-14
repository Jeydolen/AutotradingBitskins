const timestamp    = require ('time-stamp');
const exec         = require('child_process').exec;
const async_npm    = require ('async');
const assert       = require ('assert');

const sql_u        = require ('./sql_utilities.js');
const konsole      = require('./bb_log.js').konsole;
const LOG_LEVEL    = require('./bb_log.js').LOG_LEVEL;
const BB_Database  = require('./bb_database.js').BB_Database;
const BB_SqlQuery  = require('./bb_sql_query.js').BB_SqlQuery;
const rdp          = require ('./rechercheduprofit.js');
const B_L          = require ('./business-logic.js');
const bb_db  = require ('./bb_database.js');

const DATA_PATH = './data/';


var page_index = 100;

// https://stackoverflow.com/questions/23266854/node-mysql-multiple-statements-in-one-query
const executeClearQuery = (db, table) =>
{
    assert (table != undefined && table != "" && db != undefined);
    var query_text =   "DELETE FROM `" + table + "` ; ALTER TABLE `" + table + "` AUTO_INCREMENT = 0 ; ";

    var query_obj = BB_SqlQuery.Create() ;

    var query_promise = query_obj.execute( db,  query_text )
    .then( rows => {
        konsole.log(query_obj.getCommand() + " successful DELETE and ALTER '" + table + "'", LOG_LEVEL.INFO);
        query_obj = BB_SqlQuery.Create() ;
    } );
    return query_promise ;
}; // executeClearQuery ()

// !! Must be called like this: promise.then( rows => { insertNullObjectQuery((db, table) } )
const insertNullObjectQuery = (db, table, field) =>
{
    assert (table != undefined && table != "" && db != undefined && field != undefined);
    var query_text =   "INSERT INTO `" + table + "` (`id`,`"+ field + "`) VALUES (0,'NULL_" + table.toUpperCase() + "')";

    var query_obj = BB_SqlQuery.Create() ;
    query_obj.execute (db, query_text)
    .then ( rows => 
    { 
            konsole.log(query_obj.getCommand() + " successful NULL_OBJECT '" + table + "'", LOG_LEVEL.INFO);
    } );
}; // insertNullObjectQuery ()

const backupDB = () =>
{
    var now_time_stamp = timestamp('YYYY_MM_DD_HH_mm');
    var fullpath_to_sql_output_file = DATA_PATH + DB_NAME + '_' + now_time_stamp + '.sql';
    var child = exec(' mysqldump -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  DB_NAME + ' > ' + fullpath_to_sql_output_file);
    konsole.log('Backup succesfuly completed', LOG_LEVEL.OK)
}; // backupDB ()


//-----------------------------------------------------
//--------------------  restoreDB  --------------------
//-----------------------------------------------------
const restoreDB = (file_path) =>
{
    var child = exec(' mysql -u '+ ADMIN_NAME +' -p'+ ADMIN_PWD +' ' +  sql_u.DB_NAME + ' < ' + file_path);

    konsole.log('Restore succesfuly completed', LOG_LEVEL.OK)
}; // restoreDB ()
//--------------------  restoreDB  --------------------

const clearTables = () =>
{   
    var db = BB_Database.GetSingleton();
    konsole.log("db.clearTables() db: " + db.toString());

    executeClearQuery   (db, "skin_set").then (rows =>          { insertNullObjectQuery(db, "skin_set", "name" )});;
    executeClearQuery   (db, "skin").then (rows =>              { insertNullObjectQuery(db, "skin", "name" )});
    executeClearQuery   (db, "skin_sell_order").then (rows =>   { insertNullObjectQuery(db, "skin_sell_order", "market_name" )});;

}; // clearTables()


const updateDb = () => 
{
    clearTables();
  
    async_npm.until( 
      function test(cb) 
      {
        cb(null, B_L.getExitFetchItems()); 
      },
  
      function iter(cb) 
      {
        konsole.log("Traitementde la page : " + page_index, LOG_LEVEL.MSG);
        rdp.fetchItems( page_index, B_L.parseOnResponseReady );
        // console.log("avant pause de 6 sec");
        var page_ready = setTimeout(cb, 6000); 
        page_index++;
      },
  
      // End
      function (err) 
      {
        // All things are done!
        konsole.log("Main.updateDB() : Fin de traitement des pages.", LOG_LEVEL.MSG);
       }
    ); // async.whilst()

}; // updateDb ()

exports.clearTables = clearTables ;
exports.backupDB = backupDB ;
exports.restoreDB = restoreDB ;
exports.updateDb = updateDb ;