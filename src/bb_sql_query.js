// https://stackoverflow.com/questions/23339907/returning-a-value-from-callback-function-in-node-js
const assert    = require ('assert');
const asynk     = require ('async');
const Enum      = require ('enum');
const expand    = require('expand-template')();

const Konst     = require ('./constants');
const konsole   = require ('./bb_log').konsole;
const LOG_LEVEL = require ('./bb_log').LOG_LEVEL;
const pause     = require('./utility.js').pause;

const QUERY_STATE = new Enum ({ 'UNKNOWN': 0, 'PENDING': 1, 'DONE': 2, 'FAILED': 3 });

// https://dev.mysql.com/doc/refman/5.7/en/comments.html

// Placeholder https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals

const SQL_TEMPLATE = new Enum ({    
//   statement          :           template sql
    'NOTHING'           : "",
    'INSERT_NULL'       : "INSERT INTO `{db-table}`   (`name`)                      VALUES ('{db-name-value}')  ;     #INSERT_NULL" ,
    'INSERT_NAME'       : "INSERT INTO `{db-table}`   (`name`)                      VALUES ('{db-name-value}')  ;     #INSERT_NAME" , 
    'INSERT'            : "INSERT INTO `{db-table}` ({db-fields})                   VALUES ({db-field-values})  ;"                  ,
    'UPDATE_STR'        : "UPDATE {db-table} SET `{db-field}` = '{db-field-value}'  WHERE  name = '{db-name-value}' ;   #UPDATE_STR",
    'UPDATE'            : "UPDATE {db-table} SET {co-va-seq}                        WHERE  `{db-field}` = '{db-field-value}' ;"     ,
    'SELECT_NAME'       : "SELECT `id`, `name`  FROM `{db-table}`                   WHERE   `name`='{db-name-value}'; #SELECT_NAME" ,
    'SELECT'            : "SELECT {db-fields}   FROM `{db-table}`                   WHERE   {db-condition}      ;"                  ,
    'DELETE'            : "DELETE FROM {db-table}                                                               ;"                  ,
    'ALTER_RST_AI'      : "ALTER TABLE {db-table}                                   AUTO_INCREMENT = 0          ;     #ALTER_RST_AI",
    'ALTER'             : "ALTER TABLE {db-table}                                   {db-alter-value}            ;"                  ,
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
    static Instances = new Map();

    //            requis     requis
    constructor( sql_tmpl, query_text ) 
    {
        this.id             = BB_SqlQuery.name + "_" + BB_SqlQuery.Instances.size;
        this.debug          = false;
        this.state          = QUERY_STATE.UNKNOWN;
        this.sql_tmpl       = sql_tmpl;
        this.query_text     = query_text;
        this.result         = Konst.NOTHING;
        BB_SqlQuery.Instances.set(this.id, this);
    } // constructor  

    getId()         { return this.id; }                     // getId()

    getDebug()      { return this.debug; }          // getDebug()
    setDebug(value) {        this.debug = value; }  // setDebug()

    getType()       { return this.constructor.name; }       // getType()

    getName()       { return this.sql_tmpl.key; }           // getName()  

    getCommand()    { return this.sql_tmpl.toString(); }    // getCommand()  

    getResult()     { return this.result; }         // getResult()  
    setResult(value){        this.result = value; } // setResult()  

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

            else if (query_text.search("#UPDATE_STR") != -1)
                sql_tmpl = SQL_TEMPLATE.UPDATE_STR;

            else if (query_text.search("#INSERT_NAME") != -1)
                sql_tmpl = SQL_TEMPLATE.INSERT_NAME;

            else if (query_text.search("#SELECT_NAME") != -1)
                sql_tmpl = SQL_TEMPLATE.SELECT_NAME;
        }
        return sql_tmpl;
    } // _ExtractSQLTmpl()


    //             requis    requis (sauf si déjà fourni via Create())    optionnel    optionnel
    executeWithCB( db_obj,  query_text,                                   query_cb,     args )
    {   
        assert  (db_obj     != undefined);

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


        const default_query_cb = (err, result) =>
        {   
            konsole.log ("BB_SQL_QUERY executeWithCB default_cb", LOG_LEVEL.CRITICAL);
        
            if ( err )
            {   konsole.log("BB_SqlQuery execute() (peut être WAMP qui n'est pas lancé): \n" + err , LOG_LEVEL.CRITICAL) }
        
            //konsole.log( "BB_SQL_QUERY.execute() err " + err + " AFTER state: " + this.state.key, LOG_LEVEL.MSG);
                                        
            this.setResult(result);

            //konsole.log("BB_SQL_QUERY.execute() INSIDE TRY 2 after QUERY", LOG_LEVEL.WARNING );
            //konsole.log("BB_SQL_QUERY.execute() query_result :" + JSON.stringify(this.getResult()),LOG_LEVEL.OK );
        };

        if (query_cb == undefined)
            query_cb = default_query_cb;
                  
        //============ QUERY ============
        db_obj.getConnection().query
        (   this.query_text, 
            //args, 
            query_cb
        ); //========== QUERY ==========
 
    } // executeWithCB()  


    //       requis    requis (sauf si déjà fourni via Create())    optionnel
    execute( db_obj,  query_text,                                     args )
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




        const isQueryPending = () =>
        {
            //var is_query_pending = (this.state == QUERY_STATE.PENDING  ||  this.state == QUERY_STATE.UNKNOWN) || (this.result == Konst.NOTHING || this.result == undefined);
            var is_query_pending = (this.state == QUERY_STATE.PENDING  ||  this.state == QUERY_STATE.UNKNOWN) || (this.result == Konst.NOTHING || this.result == undefined);
            //konsole.log("-------xXxxXxxxxXx------ BB_SQL_QUERY.execute() isQueryPending(): " + is_query_pending+ " this.state: " + this.state.key + "-------", LOG_LEVEL.MSG);
            return is_query_pending;
        };

        const getThis = () =>
        {
            return this;
        };

        //try
        {
            //var query_result =  Konst.NOTHING;
            // https://caolan.github.io/async/v3/docs.html#compose
            //========== QUERY ==========
            //konsole.log ("BB_SqlQuery this.execute() "+ this.query_text);

            //konsole.log("BB_SQL_QUERY.execute() INSIDE TRY 1", LOG_LEVEL.WARNING );

            this.state = QUERY_STATE.PENDING;

            //asynk.doUntil( 
                asynk.doUntil( 
                    // Check if loop can be exited
                    function test( cb ) 
                    {
                      cb( null, isQueryPending() ); 
                    },
                
                    // Iteration
                    function iter( cb ) 
                    {
                        //if (getThis().debug)
                            //konsole.log("BB_SQL_QUERY.execute() ITER: Query\n" + getThis().query_text, LOG_LEVEL.MSG);
    
                        getThis().setResult(Konst.NOTHING);
                        //konsole.log("BB_SQL_QUERY.execute() query_result :" + JSON.stringify(getThis().getResult()),LOG_LEVEL.WARNING );
    
                        getThis().state = QUERY_STATE.PENDING;
    
                        //============ QUERY ============
                        db_obj.getConnection().query
                        (   getThis().query_text, 
                            //args, 
          
                            // callback
                            function( err, result )
                            {   
                                //if (getThis().getDebug())
                                //konsole.log("BB_SqlQuery execute() ITER dans cb de mysql.query" + err , LOG_LEVEL.MSG)
    
                                if ( err )
                                {   konsole.log("BB_SqlQuery execute() (peut être WAMP qui n'est pas lancé): \n" + err , LOG_LEVEL.CRITICAL);
                                    getThis().state = QUERY_STATE.FAILED;
                                }
                                else
                                    getThis().state = QUERY_STATE.DONE;
    
                                //if (getThis().getDebug())
                                    //konsole.log( "BB_SQL_QUERY.execute() err " + err + " AFTER state: " + getThis().state.key, LOG_LEVEL.MSG);
                                    
                                getThis().setResult(result);
                                //if (getThis().getDebug())
                                {
                                    //konsole.log("BB_SQL_QUERY.execute() INSIDE TRY 2 after QUERY", LOG_LEVEL.WARNING );
                                    //konsole.log("BB_SQL_QUERY.execute() query_result :" + JSON.stringify(getThis().getResult()),LOG_LEVEL.OK );
                                }
                            } 
                        ); //========== QUERY ==========
                    },
                
                    // End
                    function (err) 
                    {
                      // All things are done!
                      //konsole.log("BB_SQL_QUERY.execute() : Fin de traitement de la Query\n" + getThis().query_text, LOG_LEVEL.MSG);
                     }
                ); // async.until()              
        }
        /*
        catch( error )
        {
            konsole.log("BB_SQL_QUERY.execute() INSIDE CATCH", LOG_LEVEL.WARNING );
            konsole.log("BB_SqlQuery.execute() ERROR \n" + error , LOG_LEVEL.CRITICAL);
        } // try.. catch
        */
    } // execute()  

    
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
            return new Promise
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
exports.QUERY_STATE = QUERY_STATE ;
//------------------------------  BB_SqlQuery
