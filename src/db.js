const expand                        = require ('expand-template')();
const app_root_path                 = require('app-root-path');
const path                          = require('path');
const timestamp                     = require('time-stamp');

const { konsole, LOG_LEVEL}         = rekwire ('/src/bb_log.js');
const { DB_NAME }                   = rekwire ('/src/bb_database.js');
const { BB_Database, knex_conn }    = rekwire('/src/bb_database.js');
const BB_SqlQuery                   = rekwire('/src/bb_sql_query.js').BB_SqlQuery;
const { BitskinsObject }            = rekwire('/src/model/bb_obj.js');
const SQL_TEMPLATE                  = rekwire('/src/bb_sql_query.js').SQL_TEMPLATE;
const Konst                         = rekwire('/src/constants.js');
const CommandRegistry               = rekwire('/src/commands/command_registry.js').CommandRegistry;

const mkDBFullPath = (args) =>
{
    let folder_path = app_root_path + '/data/sql';
    let fullpath_to_sql_file = Konst.NOTHING;

    if (args == null || args == undefined)
    {
        let now_time_stamp = timestamp('YYYY_MM_DD_HH_mm');
        fullpath_to_sql_file = folder_path + "/" + DB_NAME + '_' + now_time_stamp + '.sql';
    }   
    else
    {
        if (path.basename(args) == args)
        {
            let file_name = args;
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
// https://stackoverflow.com/questions/1142472/how-to-force-mysql-to-take-0-as-a-valid-auto-increment-value
// SET GLOBAL sql_mode='NO_AUTO_VALUE_ON_ZERO'
const restoreDefaultDBState = (db, table) =>
{
    const executeDeleteQuery = () =>
    {
        let query_text  = expand(SQL_TEMPLATE.DELETE.value, { 'db-table': table});
        let query_obj   = BB_SqlQuery.Create( query_text );
        konsole.log(query_obj.getCommand() + "\t\t Trying DELETE in '" + table + "'", LOG_LEVEL.INFO);
        query_obj.executeWithCB( db,query_text, executeAlterRstAiQuery_CB );

    }; // executeDeleteQuery()
    
    
    const  executeAlterRstAiQuery_CB =  ( err,  query_delete_result ) =>
    {
        konsole.log ('DELETE SUCCESSFULL', LOG_LEVEL.INFO)
        let query_result = query_delete_result ;
        let query_insert_obj = BB_SqlQuery.Create();
    
        if ( err )
        {
            konsole.error ("DB error: " + err, LOG_LEVEL.CRITICAL); 
            return Konst.RC.KO;
        }
    
        let query_text  = expand(SQL_TEMPLATE.ALTER_RST_AI.value, { 'db-table': table});
         query_insert_obj.executeWithCB( db, query_text, executeInsertNullQuery_CB );
    }; // executeAlterRstAiQuery_CB()
    
    
    const executeInsertNullQuery_CB =  ( err, query_ARAI_result ) =>
    {
        konsole.log ('ALTER RST AI SUCCESSFULL', LOG_LEVEL.INFO)
        let query_result = query_ARAI_result;
        if ( err )
        {
            konsole.log ("BB_Obj ERREURE: " + err, LOG_LEVEL.CRITICAL); 
            afterUpdateQueryCB( null, Konst.NOTHING );
            return Konst.RC.KO;
        }     
        else
        {
            let query_update_obj  = BB_SqlQuery.Create();
            let query_text  = expand(SQL_TEMPLATE.INSERT_NULL.value, { 'db-table': table, 'db-name-value': 'NULL_'+ table.toUpperCase()});  
            query_update_obj.executeWithCB(db, query_text, afterExecuteInsertNullQuery_CB );
        }
    }; // executeInsertNullQuery_CB()
    
    
    const afterExecuteInsertNullQuery_CB =  ( err, query_insert_null_result ) =>
    {  
        konsole.log ('INSERT_NULL SUCCESSFULL', LOG_LEVEL.INFO)
        let query_result = query_insert_null_result; 
    
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
    let cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.BACKUP_DB_ID );
    cmd_klass.GetSingleton().execute(file_path);
}; // backupDB ()

const restoreDB = (file_path) =>
{
    let cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.RESTORE_DB_ID );
    cmd_klass.GetSingleton().execute(file_path);
}; // restoreDB ()

const clearTables = () =>
{   
    let db = BB_Database.GetSingleton();
    konsole.log("db.clearTables() db: " + db.toString());

   restoreDefaultDBState (db, "skin_sell_order");
   restoreDefaultDBState (db, "skin");
   restoreDefaultDBState (db, "skin_set");
   restoreDefaultDBState (db, "weapon");
    
}; // clearTables()


const restoreDefaultDBStateWithKnex = async (klass) =>
{
    let table_name = BitskinsObject._GetTableName ( klass.name )
    let knex = knex_conn;
    await knex.del().table(table_name)
    .then   ( 
            async (result) => 
                { 
                    await knex.raw('ALTER TABLE ' + table_name + ' AUTO_INCREMENT = 0;');
                }
            )
        .then   (
                async (result) => 
                    {
                        await knex.insert( { name : klass.NULL.name } ).table( table_name )
                    }
                )   

} // restoreDefaultDBStateWithKnex()




//=================================================================================================================================================== 

const UnitTestCB =  ( err, query_select_result ) =>
    {  
        konsole.log ('TEST SUCCESSFULL', LOG_LEVEL.INFO)
        let query_result = query_select_result; 
    
        if ( err )
        {
            konsole.error ('BB_OBJ.afterUpdateQueryCB() Houston on a un prbl : ' + err ); 
        }
        konsole.log ('TEST SUCCESSFULL' + JSON.stringify(query_select_result), LOG_LEVEL.OK)
    }; // afterExecuteInsertNullQuery_CB()

const unitTest = (db) =>
{
    let query_text  = 
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
    //konsole.log( query_text );
    let query_obj   = BB_SqlQuery.Create( query_text );
    query_obj.executeWithCB( db, query_text,UnitTestCB );
}
//unitTest(BB_Database.GetSingleton() );

exports.clearTables             = clearTables ;
exports.restoreDefaultDBState   = restoreDefaultDBState;
exports.restoreDefaultDBStateWithKnex = restoreDefaultDBStateWithKnex;
exports.backupDB        = backupDB ;
exports.restoreDB       = restoreDB ;
exports.mkDBFullPath    = mkDBFullPath ;
