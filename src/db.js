const timestamp    = require ('time-stamp');
const exec         = require('child_process').exec;
const async_npm    = require ('async');

const sql_u        = require ('./sql_utilities.js');
const konsole      = require('./bb_log.js').konsole;
const LOG_LEVEL    = require('./bb_log.js').LOG_LEVEL;
const BB_Database  = require('./bb_database.js').BB_Database;
const BB_SqlQuery  = require('./bb_sql_query.js').BB_SqlQuery;
const rdp          = require ('./rechercheduprofit.js');
const B_L          = require ('./business-logic.js');
const bb_db  = require ('./bb_database.js');

const DATA_PATH = './data/';


var page_index = 120;

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

    //-------------------- DELETE `skin_sell_order` --------------------
    var query_txt =   "DELETE FROM `" + bb_db.DB_NAME + "`.`skin_sell_order` ;";
    var query_obj = BB_SqlQuery.Create(query_txt) ;
    query_obj.execute( db,  query_txt  )
    .then( rows => {
        konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
    } );

    //-------------------- DELETE `skin_sell_order` --------------------
    query_txt =   "DELETE FROM `" + bb_db.DB_NAME + "`.`skin` ;";
    query_obj.execute( db, query_txt )
    .then( rows => {
        konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
    } );

    //-------------------- DELETE `skin_set` --------------------
    query_txt =   "DELETE FROM `" + bb_db.DB_NAME + "`.`skin_set` ;";
    query_obj.execute(db , query_txt )
    .then( rows => {
        konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
    } );
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