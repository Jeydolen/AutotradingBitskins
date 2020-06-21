"use strict";

const mysql     = require ('mysql');

const konsole   = require ('./bb_log').konsole;
const LOG_LEVEL = require ('./bb_log').LOG_LEVEL;
const Konst     = require ('./constants');


const DB_NAME     = 'bitskins_csgo';
const ADMIN_NAME  = "rdp_admin";
const ADMIN_PWD   = 'UZ14xdQ7E';

const CONNECTION_ARGS = 
{
    host: "localhost",
    port: "3308",
    user: ADMIN_NAME,
    password: ADMIN_PWD,
    database: DB_NAME,
    multipleStatements : true
}; // CONNECTION_ARGS




/*
 /$$$$$$$  /$$$$$$$        /$$$$$$$              /$$               /$$                                    
| $$__  $$| $$__  $$      | $$__  $$            | $$              | $$                                    
| $$  \ $$| $$  \ $$      | $$  \ $$  /$$$$$$  /$$$$$$    /$$$$$$ | $$$$$$$   /$$$$$$   /$$$$$$$  /$$$$$$ 
| $$$$$$$ | $$$$$$$       | $$  | $$ |____  $$|_  $$_/   |____  $$| $$__  $$ |____  $$ /$$_____/ /$$__  $$
| $$__  $$| $$__  $$      | $$  | $$  /$$$$$$$  | $$      /$$$$$$$| $$  \ $$  /$$$$$$$|  $$$$$$ | $$$$$$$$
| $$  \ $$| $$  \ $$      | $$  | $$ /$$__  $$  | $$ /$$ /$$__  $$| $$  | $$ /$$__  $$ \____  $$| $$_____/
| $$$$$$$/| $$$$$$$/      | $$$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$| $$$$$$$/|  $$$$$$$ /$$$$$$$/|  $$$$$$$
|_______/ |_______//$$$$$$|_______/  \_______/   \___/   \_______/|_______/  \_______/|_______/  \_______/
                  |______/                                                                                */

class BB_Database 
{
    constructor( connection_args ) 
    {
        konsole.log(">> ---- BB_Database constructor", LOG_LEVEL.MSG);
        if (connection_args == undefined) connection_args = CONNECTION_ARGS ;
        try 
        {
            this.connection = mysql.createConnection( connection_args, );
        }
        catch (error) 
        {
            konsole.log("WAMP n'est pas dispo :( ", LOG_LEVEL.CRITICAL);
        }
    } // constructor

    getConnection() 
    {
        // konsole.log("BB_Database.getConnection() this.connection " + this.connection, LOG_LEVEL.MSG)
        return this.connection;
    }

    getType() 
    {
        return this.constructor.name;
    }

    close() 
    {
        return new Promise( ( resolve, reject ) => 
        {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }

    static GetSingleton(connection_args)
    {
        if (connection_args  == undefined) 
            connection_args = CONNECTION_ARGS ;

        if (BB_Database.Singleton == undefined)
            BB_Database.Singleton = new BB_Database(connection_args) ;

        //konsole.log("BB_Database.GetSingleton() type : " + BB_Database.Singleton.getType());

        return BB_Database.Singleton;
    } // GetSingleton()

    static Create( connection_args ) 
    {
       return  BB_Database.GetSingleton();
    } // Create()  
} // BB_Database class
BB_Database.Singleton;
//------------------------------  BB_Database


exports.BB_Database = BB_Database ;
exports.DB_NAME     = DB_NAME;
exports.ADMIN_NAME  = ADMIN_NAME;
exports.ADMIN_PWD   = ADMIN_PWD;