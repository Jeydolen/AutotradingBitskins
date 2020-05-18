const assert    = require ('assert');
const Enum      = require ('enum');
const expand = require('expand-template')();

const Konst     = require ('./constants');
const konsole   = require ('./bb_log').konsole;
const LOG_LEVEL = require ('./bb_log').LOG_LEVEL;

// Placeholder https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
//                                   statement      |           template sql
const SQL_TEMPLATE = new Enum ({'NOTHING'           : "",
                                'INSERT'            : "INSERT INTO `{db-table}` ({db-fields}) VALUES ({db-field-values}) ;",
                                'UPDATE'            : "UPDATE {db-table} SET {assignment} WHERE {db-field} = {db-field-value} ;",
                                'SELECT'            : "SELECT {db-fields} FROM `{db-table}` WHERE {db-condition} ;",
                                'DELETE'            : "DELETE FROM {db-table} ;",
                                'ALTER_RST_AI'      : "ALTER TABLE {db-table} AUTO_INCREMENT = 0 ;",
                                'ALTER'             : "ALTER TABLE {db-table} {db-alter-value} ;",
                                'SHOW'              : "SHOW TABLES ;" });



/*
/$$$$$$$  /$$$$$$$        /$$$$$$   /$$$$$$  /$$        /$$$$$$                                         
| $$__  $$| $$__  $$      /$$__  $$ /$$__  $$| $$       /$$__  $$                                        
| $$  \ $$| $$  \ $$     | $$  \__/| $$  \ $$| $$      | $$  \ $$ /$$   /$$  /$$$$$$   /$$$$$$  /$$   /$$
| $$$$$$$ | $$$$$$$      |  $$$$$$ | $$  | $$| $$      | $$  | $$| $$  | $$ /$$__  $$ /$$__  $$| $$  | $$
| $$__  $$| $$__  $$      \____  $$| $$  | $$| $$      | $$  | $$| $$  | $$| $$$$$$$$| $$  \__/| $$  | $$
| $$  \ $$| $$  \ $$      /$$  \ $$| $$/$$ $$| $$      | $$/$$ $$| $$  | $$| $$_____/| $$      | $$  | $$
| $$$$$$$/| $$$$$$$/     |  $$$$$$/|  $$$$$$/| $$$$$$$$|  $$$$$$/|  $$$$$$/|  $$$$$$$| $$      |  $$$$$$$
|_______/ |_______//$$$$$$\______/  \____ $$$|________/ \____ $$$ \______/  \_______/|__/       \____  $$
                  |______/               \__/                \__/                               /$$  | $$
                                                                                               |  $$$$$$/
                                                                                                \______/  */
// https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
class BB_SqlQuery 
{
    //            requis     requis
    constructor( sql_tmpl, query_text ) 
    {
        //konsole.log("BB_SqlQuery constructor ");

        this.sql_tmpl   = sql_tmpl;
        this.query_text = query_text;
    } // constructor  

    getType() 
    {
        return this.constructor.name;
    }

    getName()
    {
        return this.sql_tmpl.key;
    } // getName()  

    getCommand()
    {
        return this.sql_tmpl.toString();
    } // getCommand()  

    _setQueryText( query_text )
    {
        this.query_text = query_text;
    } // GetNullObject()

    //                       requis
    static _ExtractSQLTmpl( query_text )
    {
        var sql_tmpl = SQL_TEMPLATE.NOTHING;
        if (query_text == undefined || query_text == '')
            return SQL_TEMPLATE;

        var query_as_words = query_text.split(' ');
        if (query_as_words.length > 0)
        {
            var first_word = query_as_words[0];
            // if (a==1)           (a==1) ?
            //    return "OK"         "OK" :
            // else
            //    return "KO";        "KO"
            sql_tmpl = 
                ( first_word == 'DELETE' ? SQL_TEMPLATE.DELETE :
                  first_word == 'INSERT' ? SQL_TEMPLATE.INSERT :
                  first_word == 'SELECT' ? SQL_TEMPLATE.SELECT :
                  first_word == 'SHOW'   ? SQL_TEMPLATE.SHOW   :
                  first_word == 'ALTER'  ? SQL_TEMPLATE.ALTER  :
                  first_word == 'UPDATE' ? SQL_TEMPLATE.UPDATE :
                  SQL_TEMPLATE.NOTHING
                );

            if (query_text.search("AUTO_INCREMENT") != -1)
                sql_tmpl = SQL_TEMPLATE.ALTER_RST_AI;
        }
        return sql_tmpl;
    } // _ExtractSQLTmpl()

    
    //       requis    requis (sauf si déjà fourni via Create())         optionnel
    execute( db_obj,  query_text,                                         args )
    {   
        assert(db_obj != undefined); 

        // konsole.log("BB_SqlQuery execute()", LOG_LEVEL.MSG);
        // konsole.log("query: " + query_text, LOG_LEVEL.MSG);

        if (query_text != undefined)    
            this.query_text = query_text;

        if (this.query_text == undefined)
            konsole.log("this.query_text is undefined !!", LOG_LEVEL.CRITICAL);
        else
        {
            var sql_tmpl = BB_SqlQuery._ExtractSQLTmpl(query_text);
            if (sql_tmpl != SQL_TEMPLATE.NOTHING)   
                this.sql_tmpl = sql_tmpl;
        }

        if (this.sql_tmpl == SQL_TEMPLATE.NOTHING)
            konsole.log("SQL_TEMPLATE is NOTHING (or not extracted coreectly from 'query_text')", LOG_LEVEL.CRITICAL);
        
        //konsole.log("BB_SqlQuery execute(): send to MySql server", LOG_LEVEL.MSG);
        //konsole.log("db_obj: " + db_obj.getType());
        //konsole.log("query_text: " + this.query_text);
         
        try
        {
            // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Promise/all
            return new Promise
            ( 
                ( resolve, reject ) => 
                {
                    //konsole.log("BB_SqlQuery Jusqu'ici TVB: " , LOG_LEVEL.INFO);
                    //========== QUERY ==========
                    db_obj.getConnection().query
                    (       this.query_text, 
                            args, 

                            ( err, rows ) => 
                            {   if ( err )
                                {   konsole.log("BB_SqlQuery execute() (peut être WAMP qui n'est pas lancé): \n" + err , LOG_LEVEL.CRITICAL);
                                    return reject( err );
                                }
                                else
                                    konsole.log("BB_SqlQuery: this.execute(): " + this.getCommand() + " successful \n", LOG_LEVEL.INFO);
                                
                                // https://riptutorial.com/javascript/example/7609/foreach-with-promises
                                resolve( rows );
                            } 
                    )
                    //========== QUERY ==========
                } 
            );
        }
        catch( error )
        {
            return new Promisen
            (   ( resolve, reject ) => 
                { konsole.log("BB_SqlQuery execute(): \n" + error , LOG_LEVEL.CRITICAL);
                }     
            );
        } // try.. catch
    } // execute()  


    //               optionnel            optionnel
    //           ex: "SELECT * FROM ..."     []
    static Create( query_text    ,         tables ) 
    {
        //konsole.log("BB_SqlQuery.Create()", LOG_LEVEL.MSG);

        var sql_tmpl = SQL_TEMPLATE.NOTHING;

        if (query_text != undefined)  
            sql_tmpl = BB_SqlQuery._ExtractSQLTmpl( query_text );

        var new_query = BB_SqlQuery.GetNullObject();
        new_query = new BB_SqlQuery( sql_tmpl, query_text );            
              
        return new_query;   
    } // Create()  

    static GetNullObject() 
    {
        if (BB_SqlQuery.NULL_QUERY == undefined)
            BB_SqlQuery.NULL_QUERY = new BB_SqlQuery( "NULL_QUERY");
        return BB_SqlQuery.NULL_QUERY;
    } // GetNullObject()  

    toString()
    {
        return this.as_text;
    } // GetNullObject()  
} // BB_SqlQuery class
BB_SqlQuery.NULL_QUERY;
BB_SqlQuery.CLEAR_TABLES;

exports.BB_SqlQuery = BB_SqlQuery;
exports.SQL_TEMPLATE = SQL_TEMPLATE;
//------------------------------  BB_SqlQuery
