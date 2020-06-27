const expand                 = require ('expand-template')();

const Konst                 = rekwire ('/src/constants.js');
const { konsole, LOG_LEVEL} = rekwire ('/src/bb_log.js');
const Command               = rekwire ('/src/commands/command.js').Command;
const BB_SqlQuery           = rekwire('/src/bb_sql_query.js').BB_SqlQuery;
const SQL_TEMPLATE          = rekwire('/src/bb_sql_query.js').SQL_TEMPLATE;
const BB_Database           = rekwire('/src/bb_database.js').BB_Database;


class ProfitSelectSkinCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
    }
    
    executeCB ( err, query_select_result )
    {  
        var query_result = query_select_result; 
    
        if ( err )
        {
            konsole.error ('BB_OBJ.afterUpdateQueryCB() Houston on a un prbl : ' + err ); 
        }
        konsole.log ('TEST SUCCESSFULL' + JSON.stringify(query_result), LOG_LEVEL.OK)
    }; // afterExecuteInsertNullQuery_CB()

    execute ( args )
    {
        var db = BB_Database.GetSingleton();
        var query_text  = 
            expand( SQL_TEMPLATE.PROFIT_SELCT_SKIN.value, 
            {   'select-parent-subquery-1': 
                expand( SQL_TEMPLATE.PROFIT_SELCT_ORDER.value,
                {   'select-subquery': 
                    expand( SQL_TEMPLATE.SELECT_SKIN.value, { 'skin-set-value': 5, 'item-state-value': 4, 'skin-rarity-value': 4 } ) ,
                    'p': 'A' } ) ,
                'select-parent-subquery-2':
                expand( SQL_TEMPLATE.PROFIT_SELCT_ORDER.value,
                {   'select-subquery': 
                    expand( SQL_TEMPLATE.SELECT_SKIN.value, { 'skin-set-value': 5, 'item-state-value': 4, 'skin-rarity-value': 3 } ) ,
                    'p': 'B'} ),
            } );
    //konsole.log( query_text );
    var query_obj   = BB_SqlQuery.Create( query_text );
    query_obj.executeWithCB( db, query_text, this.executeCB );
    }
}
exports.ProfitSelectSkinCmd = ProfitSelectSkinCmd;