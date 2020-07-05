const expand                 = require ('expand-template')();
const fs                     = require ('fs');
const assert                 = require ('assert');
const APP_ROOT_PATH          = require ('app-root-path');       
const jsonexport             = require('jsonexport');
 

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
    
    // CMD_KONST.CheckProfitableSkinCmdObj classo
    execute ( args )
    {
        assert (args != null && args != undefined, JSON.stringify(args));

        const mkFilepath = ( file_name, ext ) =>
        {
            var file_path = APP_ROOT_PATH + '\\data\\' + ext + '\\'+ file_name + '.' + ext;
            return file_path;
        };

        const executeCB = ( err, query_result ) =>
        {  
            var csv_file_path  = mkFilepath( 'test', 'csv' );
            var json_file_path = mkFilepath( 'test', 'json' );
            
            if ( err )
            {
                konsole.error ('ProfitSelectSkinCmd.executeCB() ' + err ); 
                return Konst.RC.KO;
            }

            const writeFileCB = () =>
            {
                if ( err )
                {
                    konsole.error ('ProfitSelectSkinCmd.writeFileCB() on a un prbl : ' + err ); 
                    return Konst.RC.KO;
                }
                konsole.log ('File written');
            }; // writeFileCB()

            fs.writeFile ( json_file_path, JSON.stringify(query_result[0]), 'utf8', writeFileCB )

            var csv_data = Konst.NOTHING;
            jsonexport( query_result[0] , function(err, csv)
            {
                if(err) return console.error(err);
                csv_data = csv;
                fs.writeFile ( csv_file_path, csv_data,'utf8', writeFileCB )
            });

        }; // executeCB()


        var db = BB_Database.GetSingleton();
        var query_text  = 
            expand( SQL_TEMPLATE.PROFIT_SELCT_SKIN.value, 
            {   'select-parent-subquery-1': 
                expand( SQL_TEMPLATE.PROFIT_SELCT_ORDER.value,
                {   'select-subquery': 
                    expand( SQL_TEMPLATE.SELECT_SKIN.value, 
                        { 'skin-set-value' : args.skin_set_value, 'item-state-value' : args.item_state_value, 'skin-rarity-value' : args.skin_rarity_value } ) ,
                        'p': 'A' } ) ,
                'select-parent-subquery-2':
                expand( SQL_TEMPLATE.PROFIT_SELCT_ORDER.value,
                {   'select-subquery': 
                    expand( SQL_TEMPLATE.SELECT_SKIN.value, 
                        { 'skin-set-value':args.skin_set_value , 'item-state-value': args.item_state_value, 'skin-rarity-value' : args.skin_rarity_value -1 } ) ,
                        'p': 'B'} ),
            } );
        //konsole.log( query_text );
        var query_obj   = BB_SqlQuery.Create( query_text );
        query_obj.executeWithCB( db, query_text, executeCB );
    } // execute()
} // ProfitSelectSkinCmd class 
exports.ProfitSelectSkinCmd = ProfitSelectSkinCmd;