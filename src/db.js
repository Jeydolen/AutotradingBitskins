const timestamp    = require ('time-stamp');
const exec         = require('child_process').exec;
const asynk        = require ('async');
const assert       = require ('assert');
const expand       = require ('expand-template')();

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

//===================================================================================================================================================
const restoreDefaultDBState =  (db, table) =>
{
    const executeDeleteQuery = () =>
    {
        var query_text  = expand(SQL_TEMPLATE.DELETE.value, { 'db-table': table});
        var query_obj   = BB_SqlQuery.Create( query_text );
        konsole.log(query_obj.getCommand() + "\t\t Trying DELETE in '" + table + "'", LOG_LEVEL.INFO);
         query_obj.executeWithCB( db,query_text, executeAlterRstAiQuery_CB );

    }; // executeDeleteQuery()
    
    
    const  executeAlterRstAiQuery_CB =  ( err,  query_delete_result ) =>
    {
        konsole.log ('DELETE SUCCESSFULL', LOG_LEVEL.INFO)
        var query_result = query_delete_result ;
        var query_insert_obj = BB_SqlQuery.Create();
    
        if ( err )
        {
            konsole.error ("DB error: " + err, LOG_LEVEL.CRITICAL); 
            return Konst.RC.KO;
        }
    
        var query_text  = expand(SQL_TEMPLATE.ALTER_RST_AI.value, { 'db-table': table});
         query_insert_obj.executeWithCB( db, query_text, executeInsertNullQuery_CB );
    }; // executeAlterRstAiQuery_CB()
    
    
    const executeInsertNullQuery_CB =  ( err, query_ARAI_result ) =>
    {
        konsole.log ('ALTER RST AI SUCCESSFULL', LOG_LEVEL.INFO)
        var query_result = query_ARAI_result;
        if ( err )
        {
            konsole.log ("BB_Obj ERREURE: " + err, LOG_LEVEL.CRITICAL); 
            afterUpdateQueryCB( null, Konst.NOTHING );
            return Konst.RC.KO;
        }     
        else
        {
            var query_update_obj  = BB_SqlQuery.Create();
            var query_text  = expand(SQL_TEMPLATE.INSERT_NULL.value, { 'db-table': table, 'db-name-value': 'NULL_'+ table.toUpperCase()});  
            query_update_obj.executeWithCB(db, query_text, afterExecuteInsertNullQuery_CB );
        }
    }; // executeInsertNullQuery_CB()
    
    
    const afterExecuteInsertNullQuery_CB =  ( err, query_insert_null_result ) =>
    {  
        konsole.log ('INSERT_NULL SUCCESSFULL', LOG_LEVEL.INFO)
        var query_result = query_insert_null_result; 
    
        if ( err )
        {
            konsole.error ('BB_OBJ.afterUpdateQueryCB() Houston on a un prbl : ' + err ); 
        }
        konsole.log ('RESET SUCCESSFULL', LOG_LEVEL.OK)
    }; // afterExecuteInsertNullQuery_CB()

    executeDeleteQuery(db, table)

}; // restoreDefaultDBState


//===================================================================================================================================================
                           
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

    // https://caolan.github.io/async/v3/seq.js.html
    var D_ARAI_IN = asynk.seq( executeDeleteQuery, executeAlterRstAiQuery, executeInsertNullQuery );
    D_ARAI_IN
    (   db, table, 
        () => 
        { konsole.log("D_ARAI_IN successful !!", LOG_LEVEL.OK)
        }
    );

};

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

   restoreDefaultDBState (db, "skin_sell_order");
   restoreDefaultDBState (db, "skin");
   restoreDefaultDBState (db, "skin_set");
   restoreDefaultDBState (db, "weapon");
    
}; // clearTables()

exports.clearTables = clearTables ;
exports.backupDB = backupDB ;
exports.restoreDB = restoreDB ;
exports.restoreDefaultDBState = restoreDefaultDBState;
//exports.updateDb = updateDb ;