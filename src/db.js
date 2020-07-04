const expand                = require ('expand-template')();
const app_root_path         = require('app-root-path');
const path                  = require('path');
const timestamp             = require('time-stamp');

const { konsole, LOG_LEVEL} = rekwire ('/src/bb_log.js');
const { DB_NAME }           = rekwire ('/src/bb_database.js');
const BB_Database           = rekwire('/src/bb_database.js').BB_Database;
const BB_SqlQuery           = rekwire('/src/bb_sql_query.js').BB_SqlQuery;
const SQL_TEMPLATE          = rekwire('/src/bb_sql_query.js').SQL_TEMPLATE;
const Konst                 = rekwire('/src/constants.js');
const CommandRegistry       = rekwire('/src/commands/command_registry.js').CommandRegistry;

const mkDBFullPath = (args) =>
{
    var folder_path = app_root_path + '/data/sql';
    var fullpath_to_sql_file = Konst.NOTHING;

    if (args == null || args == undefined)
    {
        var now_time_stamp = timestamp('YYYY_MM_DD_HH_mm');
        fullpath_to_sql_file = folder_path + "/" + DB_NAME + '_' + now_time_stamp + '.sql';
    }   
    else
    {
        if (path.basename(args) == args)
        {
            var file_name = args;
            if (! file_name.endsWith('.sql'))   file_name += '.sql';
            fullpath_to_sql_file = folder_path + "/" + file_name;
        }
        else 
        {
            fullpath_to_sql_file = args;
        }
    }  
    return   fullpath_to_sql_file;
} // mkDBFullPath

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

const backupDB = () =>  
{
    var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.BACKUP_DB_ID );
    cmd_klass.GetSingleton().execute(file_path);
}; // backupDB ()

const restoreDB = (file_path) =>
{
    var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.RESTORE_DB_ID );
    cmd_klass.GetSingleton().execute(file_path);
}; // restoreDB ()

const clearTables = () =>
{   
    var db = BB_Database.GetSingleton();
    konsole.log("db.clearTables() db: " + db.toString());

   restoreDefaultDBState (db, "skin_sell_order");
   restoreDefaultDBState (db, "skin");
   restoreDefaultDBState (db, "skin_set");
   restoreDefaultDBState (db, "weapon");
    
}; // clearTables()
//=================================================================================================================================================== 

const UnitTestCB =  ( err, query_select_result ) =>
    {  
        konsole.log ('TEST SUCCESSFULL', LOG_LEVEL.INFO)
        var query_result = query_select_result; 
    
        if ( err )
        {
            konsole.error ('BB_OBJ.afterUpdateQueryCB() Houston on a un prbl : ' + err ); 
        }
        konsole.log ('TEST SUCCESSFULL' + JSON.stringify(query_select_result), LOG_LEVEL.OK)
    }; // afterExecuteInsertNullQuery_CB()

const unitTest = (db) =>
{
    var query_text  = 
            expand( SQL_TEMPLATE.PROFIT_SELCT_SKIN.value, 
            {   'select-parent-subquery-1': 
                expand( SQL_TEMPLATE.PROFIT_SELCT_ORDER.value,
                {   'select-subquery': 
                    expand( SQL_TEMPLATE.SELECT_SKIN.value, { 'skin-set-value': 5, 'item-state-value': 4, 'skin-rarity-value': 3 } ) ,
                    'p': 'A' } ) ,
                'select-parent-subquery-2':
                expand( SQL_TEMPLATE.PROFIT_SELCT_ORDER.value,
                {   'select-subquery': 
                    expand( SQL_TEMPLATE.SELECT_SKIN.value, { 'skin-set-value': 5, 'item-state-value': 4, 'skin-rarity-value': 3 } ) ,
                    'p': 'B'} ),
            } );
    konsole.log( query_text );
    var query_obj   = BB_SqlQuery.Create( query_text );
    query_obj.executeWithCB( db, query_text,UnitTestCB );
}
//unitTest(BB_Database.GetSingleton() );

exports.clearTables             = clearTables ;
exports.restoreDefaultDBState   = restoreDefaultDBState;
exports.backupDB        = backupDB ;
exports.restoreDB       = restoreDB ;
exports.mkDBFullPath    = mkDBFullPath ;
