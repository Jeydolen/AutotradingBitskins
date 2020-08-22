// https://stackoverflow.com/questions/23339907/returning-a-value-from-callback-function-in-node-js
const assert    = require ('assert');
const Enum      = require ('enum');
const expand    = require('expand-template')();

if (global.rekwire == undefined)
    global.rekwire = require ('app-root-path').require;

const Konst                     = rekwire ('/src/constants.js');
const { konsole, LOG_LEVEL }    = rekwire ('/src/bb_log.js');

// https://dev.mysql.com/doc/refman/5.7/en/comments.html

const SQL_TEMPLATE = new Enum ({    
//   statement          :           template sql
    'NOTHING'           : "",
    'INSERT_NULL'       : "INSERT INTO `{db-table}`   (`name`, `id`)                VALUES ('{db-name-value}',0);     #INSERT_NULL" ,
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
    let sql_tmpl =  (
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

/*$$$$$$$  /$$$$$$$        /$$$$$$   /$$$$$$  /$$        /$$$$$$                                         
| $$__  $$| $$__  $$      /$$__  $$ /$$__  $$| $$       /$$__  $$                                        
| $$  \ $$| $$  \ $$     | $$  \__/| $$  \ $$| $$      | $$  \ $$ /$$   /$$  /$$$$$$   /$$$$$$  /$$   /$$
| $$$$$$$ | $$$$$$$      |  $$$$$$ | $$  | $$| $$      | $$  | $$| $$  | $$ /$$__  $$ /$$__  $$| $$  | $$
| $$__  $$| $$__  $$      \____  $$| $$  | $$| $$      | $$  | $$| $$  | $$| $$$$$$$$| $$  \__/| $$  | $$
| $$  \ $$| $$  \ $$      /$$  \ $$| $$/$$ $$| $$      | $$/$$ $$| $$  | $$| $$_____/| $$      | $$  | $$
| $$$$$$$/| $$$$$$$/     |  $$$$$$/|  $$$$$$/| $$$$$$$$|  $$$$$$/|  $$$$$$/|  $$$$$$$| $$      |  $$$$$$$
|_______/ |_______//$$$$$$\______/  \____ $$$|________/ \____ $$$ \______/  \_______/|__/       \____  $$
                  |______/               \__/                \__/                               /$$  | $$
                                                                                               |  $$$$$$/
                                                                                                \______*/


class BB_SqlQuery 
{
    static Instances = new Map();

    //            requis     requis
    constructor( sql_tmpl, query_text ) 
    {
        this.id             = BB_SqlQuery.name + "_" + BB_SqlQuery.Instances.size;
        this.debug          = false;
        this.sql_tmpl       = sql_tmpl;
        this.query_text     = query_text;
        this.result         = Konst.NOTHING;
        BB_SqlQuery.Instances.set(this.id, this);
    } // constructor  

    getId()         { return this.id; }                     // getId()
    getDebug()      { return this.debug; }                  // getDebug()
    setDebug(value) {        this.debug = value; }          // setDebug()
    getType()       { return this.constructor.name; }       // getType()
    getName()       { return this.sql_tmpl.key; }           // getName()  
    getCommand()    { return this.sql_tmpl.toString(); }    // getCommand()  
    getResult()     { return this.result; }                 // getResult()  
    setResult(value){        this.result = value; }         // setResult()  

    //                       requis
    static _ExtractSQLTmpl( query_text )
    {
        let sql_tmpl = SQL_TEMPLATE.NOTHING;
        if (query_text == undefined || query_text == '')
            return SQL_TEMPLATE;

        let query_as_words = query_text.split(' ');
        if (query_as_words.length > 0)
        {
            let statement   = query_as_words[0];
            sql_tmpl        = statement2sqlTmpl( statement );

            if (query_text.search("#ALTER_RST_AI") != -1)
                sql_tmpl = SQL_TEMPLATE.ALTER_RST_AI;

            else if (query_text.search("#INSERT_NULL") != -1)
                sql_tmpl = SQL_TEMPLATE.INSERT_NULL;

            else if (query_text.search("#UPDATE_STR") != -1)
                sql_tmpl = SQL_TEMPLATE.UPDATE_STR;

            else if (query_text.search("#SELECT_SKIN") != -1)
                sql_tmpl = SQL_TEMPLATE.SELECT_SKIN;

            else if (query_text.search("#PROFIT_SELCT_ORDER") != -1)
                sql_tmpl = SQL_TEMPLATE.PROFIT_SELCT_ORDER;

            else if (query_text.search("#PROFIT_SELCT_SKIN") != -1)
                sql_tmpl = SQL_TEMPLATE.PROFIT_SELCT_SKIN;

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

        if (query_text != undefined)    
            this.query_text = query_text;

        if (this.query_text == undefined)
            konsole.log("this.query_text is undefined !!", LOG_LEVEL.CRITICAL);
        else
        {
            let sql_tmpl = BB_SqlQuery._ExtractSQLTmpl(query_text);
            if (sql_tmpl != SQL_TEMPLATE.NOTHING)   
                this.sql_tmpl = sql_tmpl;
        }

        if (this.sql_tmpl == SQL_TEMPLATE.NOTHING)
            konsole.log("SQL_TEMPLATE is NOTHING (or not extracted coreectly from 'query_text')", LOG_LEVEL.CRITICAL);


        const default_query_cb = (err, result) =>
        {   
            //konsole.log ("BB_SQL_QUERY executeWithCB default_cb", LOG_LEVEL.CRITICAL);
        
            if ( err )
            {   konsole.log("BB_SqlQuery execute() (peut être WAMP qui n'est pas lancé): \n" + err , LOG_LEVEL.CRITICAL) }
                                        
            this.setResult(result);
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


    //               optionnel            optionnel
    //           ex: "SELECT * FROM ..."     []
    static Create( query_text    ,         tables ) 
    {
        //konsole.log("BB_SqlQuery.Create()", LOG_LEVEL.MSG);

        let sql_tmpl = SQL_TEMPLATE.NOTHING;

        if (query_text != undefined)  
            sql_tmpl = BB_SqlQuery._ExtractSQLTmpl( query_text );

        let new_query = BB_SqlQuery.GetNullObject();
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
