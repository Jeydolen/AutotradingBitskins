"use strict";

const assert    = require ('assert');
const Enum      = require ('enum');

const Konst     = require ('./constants');
const konsole   = require ('./bb_log').konsole;
const LOG_LEVEL = require ('./bb_log').LOG_LEVEL;

const CMD_TYPE = new Enum (['NOTHING', 'DELETE', 'SHOW', 'INSERT', 'SELECT', 'ALTER', 'UPDATE']);



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
    constructor( cmd_type, query_text ) 
    {
        //konsole.log("BB_SqlQuery constructor ");

        this.cmd_type   = cmd_type;
        this.query_text = query_text;
    } // constructor  

    getType() 
    {
        return this.constructor.name;
    }

    getName()
    {
        return this.cmd_type.key;
    } // getName()  

    getCommand()
    {
        return this.cmd_type.toString();
    } // getCommand()  

    _setQueryText( query_text )
    {
        this.query_text = query_text;
    } // GetNullObject()

    //                       requis
    static _ExtractCmdType( query_text )
    {
        var cmd_type = CMD_TYPE.NOTHING;
        if (query_text == undefined || query_text == '')
            return cmd_type;

        var query_as_words = query_text.split(' ');
        if (query_as_words.length > 0)
        {
            var first_word = query_as_words[0];
            // if (a==1)           (a==1) ?
            //    return "OK"         "OK" :
            // else
            //    return "KO";        "KO"
            cmd_type = 
                ( first_word == 'DELETE' ? CMD_TYPE.DELETE :
                  first_word == 'INSERT' ? CMD_TYPE.INSERT :
                  first_word == 'SELECT' ? CMD_TYPE.SELECT :
                  first_word == 'SHOW'   ? CMD_TYPE.SHOW   :
                  first_word == 'ALTER'  ? CMD_TYPE.ALTER  :
                  first_word == 'UPDATE' ? CMD_TYPE.UPDATE :
                  CMD_TYPE.NOTHING
                );
        }
        return cmd_type;
    } // _ExtractCmdType()

    
    //       requis    requis (sauf si déjà fourni via Create())         optionnel
    execute( db_obj,  query_text,                                         args )
    {   
        assert(db_obj != undefined); 

        // konsole.log("BB_SqlQuery execute()", LOG_LEVEL.MSG);
        // konsole.log("query: " + query_text, LOG_LEVEL.MSG);

        if (query_text != undefined)    this.query_text = query_text;

        if (this.query_text == undefined)
            konsole.log("this.query_text is undefined !!", LOG_LEVEL.CRITICAL);
        else
        {
            var cmd_type = BB_SqlQuery._ExtractCmdType(query_text);
            if (cmd_type != CMD_TYPE.NOTHING)   this.cmd_type = cmd_type;
        }

        if (this.CMD_TYPE == CMD_TYPE.NOTHING)
            konsole.log("CMD_TYPE is NOTHING (or not extracted coreectly from 'query_text')", LOG_LEVEL.CRITICAL);
        
        //konsole.log("BB_SqlQuery execute(): send to MySql server", LOG_LEVEL.MSG);
        //konsole.log("db_obj: " + db_obj.getType());
        //konsole.log("query_text: " + this.query_text);
         
        try
        {
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
                                    
                                resolve( rows );
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
    } // execute()  


    //               optionnel            optionnel
    //           ex: "SELECT * FROM ..."     []
    static Create( query_text    ,         tables ) 
    {
        //konsole.log("BB_SqlQuery.Create()", LOG_LEVEL.MSG);

        var cmd_type = CMD_TYPE.NOTHING;

        if (query_text != undefined)  cmd_type = BB_SqlQuery._ExtractCmdType( query_text );

        var new_query = BB_SqlQuery.GetNullObject();
        //konsole.log("cmd_type : " + cmd_type);
        new_query = new BB_SqlQuery( cmd_type, query_text );            
              
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
//------------------------------  BB_SqlQuery
