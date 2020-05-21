const assert    = require ('assert');
const asynk     = require ('async');
const Enum      = require ('enum');
const expand = require('expand-template')();

const Konst     = require ('./constants');
const konsole   = require ('./bb_log').konsole;
const LOG_LEVEL = require ('./bb_log').LOG_LEVEL;

// https://dev.mysql.com/doc/refman/5.7/en/comments.html

// Placeholder https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
//                                   statement          |           template sql
const SQL_TEMPLATE = new Enum ({    'NOTHING'           : "",
                                    'INSERT_NULL'       : "INSERT INTO `{db-table}`   (`name`)      VALUES ('{db-name-value}')  ;     #INSERT_NULL" ,
                                    'INSERT_NAME'       : "INSERT INTO `{db-table}`   (`name`)      VALUES ('{db-name-value}')  ;     #INSERT_NAME" , 
                                    'INSERT'            : "INSERT INTO `{db-table}` ({db-fields})   VALUES ({db-field-values})  ;"                  ,
                                    'UPDATE'            : "UPDATE {db-table} SET {assignment}       WHERE  {db-field} = {db-field-value} ;"         ,
                                    'SELECT_NAME'       : "SELECT `id`, `name`  FROM `{db-table}`   WHERE   `name`='{db-name-value}'; #SELECT_NAME" ,
                                    'SELECT'            : "SELECT {db-fields}   FROM `{db-table}`   WHERE   {db-condition}        ;"                ,
                                    'DELETE'            : "DELETE FROM {db-table}                                               ;"                  ,
                                    'ALTER_RST_AI'      : "ALTER TABLE {db-table}                   AUTO_INCREMENT = 0          ;     #ALTER_RST_AI",
                                    'ALTER'             : "ALTER TABLE {db-table}                   {db-alter-value}            ;"                  ,
                                    'SHOW'              : "SHOW TABLES ;" });

const statement2sqlTmpl = ( statement ) =>
{
    var sql_tmpl =  (
                    statement ==    'DELETE'            ? SQL_TEMPLATE.DELETE :
                    statement ==    'INSERT'            ? SQL_TEMPLATE.INSERT :
                    statement ==    'SELECT'            ? SQL_TEMPLATE.SELECT :
                    statement ==    'SHOW'              ? SQL_TEMPLATE.SHOW   :
                    statement ==    'ALTER'             ? SQL_TEMPLATE.ALTER  :
                    statement ==    'UPDATE'            ? SQL_TEMPLATE.UPDATE :
                    SQL_TEMPLATE.NOTHING
                    );
    return sql_tmpl;
}; // statement2sqlTmpl()

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
        this.sql_tmpl       = sql_tmpl;
        this.query_text     = query_text;
        this.result         = {};
    } // constructor  

    getType() 
    {   return this.constructor.name;
    } // getType()

    getName()
    {   return this.sql_tmpl.key;
    } // getName()  

    getCommand()
    {   return this.sql_tmpl.toString();
    } // getCommand()  

    getResult()
    {   return this.result;
    } // getResult()  

    setResult( result )
    {   this.result = result;
    } // setResult()  

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
            var statement   = query_as_words[0];
            sql_tmpl        = statement2sqlTmpl( statement );

            if (query_text.search("#ALTER_RST_AI") != -1)
                sql_tmpl = SQL_TEMPLATE.ALTER_RST_AI;

            else if (query_text.search("#INSERT_NULL") != -1)
                sql_tmpl = SQL_TEMPLATE.INSERT_NULL;

            else if (query_text.search("#INSERT_NAME") != -1)
                sql_tmpl = SQL_TEMPLATE.INSERT_NAME;

            else if (query_text.search("#SELECT_NAME") != -1)
                sql_tmpl = SQL_TEMPLATE.SELECT_NAME;
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
                
        try
        {
            // https://caolan.github.io/async/v3/docs.html#compose
            //========== QUERY ==========
            //konsole.log ("BB_SqlQuery this.execute() "+ this.query_text);

            db_obj.getConnection().query
            (   this.query_text, 
                args, 

                ( err, query_result ) => 
                {   if ( err )
                    {   konsole.log("BB_SqlQuery execute() (peut être WAMP qui n'est pas lancé): \n" + err , LOG_LEVEL.CRITICAL);
                    }
                } 
            );
            //========== QUERY ==========
        }
        catch( error )
        {
            konsole.log("BB_SqlQuery execute(): \n" + error , LOG_LEVEL.CRITICAL);
        } // try.. catch
    } // executeWProm()  

    
    //       requis    requis (sauf si déjà fourni via Create())         optionnel
    executeWProm( db_obj,  query_text,                                         args )
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

                            ( err, query_result ) => 
                            {   if ( err )
                                {   konsole.log("BB_SqlQuery execute() (peut être WAMP qui n'est pas lancé): \n" + err , LOG_LEVEL.CRITICAL);
                                    return reject( err );
                                }

                                
                                // https://riptutorial.com/javascript/example/7609/foreach-with-promises
                                resolve( query_result );
                                konsole.log ("BB_SqlQuery this.execute() "+ this.query_text);
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
    } // executeWProm()  


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
