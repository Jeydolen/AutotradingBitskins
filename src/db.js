const timestamp    = require ('time-stamp');
const exec         = require('child_process').exec;
const asynk        = require ('async');
const assert       = require ('assert');
const expand       = require ('expand-template')();

const sql_u        = require ('./sql_utilities.js');
const konsole      = require('./bb_log.js').konsole;
const LOG_LEVEL    = require('./bb_log.js').LOG_LEVEL;
const BB_Database  = require('./bb_database.js').BB_Database;
const BB_SqlQuery  = require('./bb_sql_query.js').BB_SqlQuery;
const SQL_TEMPLATE = require('./bb_sql_query.js').SQL_TEMPLATE;
const rdp          = require ('./rechercheduprofit.js');
const B_L          = require ('./business-logic.js');
const bb_db        = require ('./bb_database.js');
const Konst        = require('./constants.js');

const DATA_PATH = './data/';

// ----------------------------------------- Commencement de page
var page_index = Konst.PAGE_INDEX_START;
// ----------------------------------------------------------------

const executeDeleteQuery = ( db , table , cb ) =>
{   
    var query_text  = expand(SQL_TEMPLATE.DELETE.value, { 'db-table': table});
    var query_obj   = BB_SqlQuery.Create( query_text );
    konsole.log(query_obj.getCommand() + "\t\t Trying DELETE in '" + table + "'", LOG_LEVEL.INFO);
    query_obj.execute( db,query_text );
    cb( null, db , table);
}; // executeDeleteQuery()


const executeAlterRstAiQuery = ( db , table, cb ) =>
{   
    var query_text  = expand(SQL_TEMPLATE.ALTER_RST_AI.value, { 'db-table': table});
    var query_obj   = BB_SqlQuery.Create( query_text );
    konsole.log(query_obj.getCommand() + "\t Trying ALTER_RST_AI in '" + table + "'", LOG_LEVEL.INFO);
    query_obj.execute( db, query_text );
    cb( null, db , table);
}; // executeAlterRstAiQuery()


const executeInsertNullQuery = ( db , table, cb ) =>
{   
    var query_text  = expand(SQL_TEMPLATE.INSERT_NULL.value, { 'db-table': table, 'db-name-value': 'NULL_'+ table.toUpperCase()});
    var query_obj   = BB_SqlQuery.Create( query_text );
    konsole.log(query_obj.getCommand() + "\t Trying INSERT_NULL in '" + table + "'\n", LOG_LEVEL.INFO);
    query_obj.execute( db, query_text );
}; // executeInsertNullQuery()



// https://stackoverflow.com/questions/23266854/node-mysql-multiple-statements-in-one-query
const executeClearQuery = (db, table) =>
{
    assert (table != undefined && table != "" && db != undefined);
    //var query_text =   "DELETE FROM `" + table + "` ; ALTER TABLE `" + table + "` AUTO_INCREMENT = 0 ; ";

    // https://caolan.github.io/async/v3/seq.js.html
    var D_ARAI_IN = asynk.seq( executeDeleteQuery, executeAlterRstAiQuery, executeInsertNullQuery );
    D_ARAI_IN
    (   db, table, 
        () => 
        { konsole.log("D_ARAI_IN successful !!", LOG_LEVEL.OK)
        }
    );

    return Konst.RC.OK;

    //=================================================================================
    // konsole.log("query_text: " + query_text, LOG_LEVEL.OK);

    var query_delete_obj        = BB_SqlQuery.Create();
    var query_alter_obj         = BB_SqlQuery.Create();
    var query_insert_null_obj   = BB_SqlQuery.Create();

    var query_insert_null_promise;

    // 1. DELETE Query
    var query_delete_text       = expand(SQL_TEMPLATE.DELETE.value, { 'db-table': table});
    var query_delete_promise    = query_delete_obj.execute( db,  query_delete_text )
    .then( () =>  
    {   // Definition de resolve() pour DELETE
        konsole.log(query_delete_obj.getCommand() + "\t\t successful CLEAR (DELETE) in '" + table + "'", LOG_LEVEL.INFO);
        
        // 2. ALTER Query
        var query_alter_text = expand(SQL_TEMPLATE.ALTER_RST_AI.value, { 'db-table': table});

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#Chaining
        // Note that () => x is short for () => { return x; }
        var query_alter_promise = query_alter_obj.execute( db,  query_alter_text );
        //return query_alter_promise;
    } )
    .then( () =>  
    {   // Definition de resolve() pour ALTER
        konsole.log(query_alter_obj.getCommand() + "\t successful ALTER_RST_AI in '" + table + "'", LOG_LEVEL.INFO);

        // 3. INSERT_NULL Query
        var query_insert_null_text = expand(SQL_TEMPLATE.INSERT_NULL.value, { 'db-table': table, 'db-name-value': 'NULL_'+ table.toUpperCase()});
        // konsole.log(query_insert_null_text);
        query_insert_null_promise = query_insert_null_obj.execute( db,  query_insert_null_text ); 
        //return query_insert_null_promise;
    } )
    .then( () => 
    {   // Definition de resolve() pour Résultat de INSERT_NULL
        konsole.log(query_insert_null_obj.getCommand() + "\t successful INSERT_NULL in '" + table + "'\n", LOG_LEVEL.INFO);
        //return query_delete_promise;
    } )
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#Chaining@"Chaining after a catch"
    .catch( () =>
    {   // Definition de reject()
            konsole.log("db.executeClearQuery() ERROR \n", LOG_LEVEL.CRITICAL);
        }
    );

    /*
    .catch(    
    {   // Definition de reject()
        konsole.log(query_insert_null_obj.getCommand() + "\t successful INSERT_NULL in '" + table + "'\n", LOG_LEVEL.INFO);
    }
    ));
*/

    //return query_insert_null_promise ;
    //return query_delete_promise ;
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
            //konsole.log(query_obj.getCommand() + " successful NULL_OBJECT in '" + table + "'", LOG_LEVEL.INFO);
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

    executeClearQuery   (db, "skin_set");//.then (rows =>          { insertNullObjectQuery(db, "skin_set", "name" )});
    executeClearQuery   (db, "skin");//.then (rows =>              { insertNullObjectQuery(db, "skin", "name" )});
    executeClearQuery   (db, "skin_sell_order");//.then (rows =>   { insertNullObjectQuery(db, "skin_sell_order", "market_name" )});

}; // clearTables()


const updateDb = () => 
{
    clearTables();
  
    asynk.until( 
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
        konsole.log("Main.updateDB() : Fin de traitement des pages (depuis: " + Konst.PAGE_INDEX_START + ")", LOG_LEVEL.MSG);
       }
    ); // async.whilst()

}; // updateDb ()

exports.clearTables = clearTables ;
exports.backupDB = backupDB ;
exports.restoreDB = restoreDB ;
exports.updateDb = updateDb ;