const asynk             = require ('async');
const assert            = require ('assert');
const request           = require('request');
const totp              = require('notp').totp;
const base32            = require('thirty-two');
const fetch             = require('node-fetch');


const BB_Database       = require ('./bb_database.js').BB_Database;
const db                = require ('./db.js');
const Konst             = require ('./constants.js');
const konsole           = require ('./bb_log.js').konsole;
const LOG_LEVEL         = require ('./bb_log.js').LOG_LEVEL ;
const pause     = require('./utility.js').pause;

const BB_Pop            = require ('./bb_populater.js');
const DBPopulater       = require ('./bb_populater.js').DBPopulater;


const SECRET_BITSKINS               = "ZW3LWWCSRIAVMVNR";
const API_KEY                       = "3c75df64-c4c1-4066-8e65-34de828dd08e";
const BITSKINS_FETCHER_SINGLETON    = "BITSKINS_FETCHER_SINGLETON";

//______________________________________________________________________
const PAGE_INDEX_START = 2; //----------------------------------------
//______________________________________________________________________

/*
 /$$$$$$$  /$$   /$$              /$$       /$$                     /$$$$$$$$          /$$               /$$                          
| $$__  $$|__/  | $$             | $$      |__/                    | $$_____/         | $$              | $$                          
| $$  \ $$ /$$ /$$$$$$   /$$$$$$$| $$   /$$ /$$ /$$$$$$$   /$$$$$$$| $$     /$$$$$$  /$$$$$$    /$$$$$$$| $$$$$$$   /$$$$$$   /$$$$$$ 
| $$$$$$$ | $$|_  $$_/  /$$_____/| $$  /$$/| $$| $$__  $$ /$$_____/| $$$$$ /$$__  $$|_  $$_/   /$$_____/| $$__  $$ /$$__  $$ /$$__  $$
| $$__  $$| $$  | $$   |  $$$$$$ | $$$$$$/ | $$| $$  \ $$|  $$$$$$ | $$__/| $$$$$$$$  | $$    | $$      | $$  \ $$| $$$$$$$$| $$  \__/
| $$  \ $$| $$  | $$ /$$\____  $$| $$_  $$ | $$| $$  | $$ \____  $$| $$   | $$_____/  | $$ /$$| $$      | $$  | $$| $$_____/| $$      
| $$$$$$$/| $$  |  $$$$//$$$$$$$/| $$ \  $$| $$| $$  | $$ /$$$$$$$/| $$   |  $$$$$$$  |  $$$$/|  $$$$$$$| $$  | $$|  $$$$$$$| $$      
|_______/ |__/   \___/ |_______/ |__/  \__/|__/|__/  |__/|_______/ |__/    \_______/   \___/   \_______/|__/  |__/ \_______/|_*/      
                                                                                                                                
class BitskinsFetcher

{
    static Instances = new Map();
    static result   = null;
    static Singleton = BitskinsFetcher.GetSingleton();
    
    constructor (name)
    {
        assert ( BitskinsFetcher.Instances.size <1) ; // Singleton Design Pattern
        this.name                   = name;
        this.exitFetchItems         = false;
        this._is_last_page          = false;
        this._page_index            = PAGE_INDEX_START;
        this._is_populate_finished  = false;
    } // constructor


    static GetSingleton()
    {
        if (BitskinsFetcher.Singleton == undefined)
        {
            BitskinsFetcher.Singleton = new BitskinsFetcher( BITSKINS_FETCHER_SINGLETON ) ;
            BitskinsFetcher.Instances.set ( BITSKINS_FETCHER_SINGLETON, BitskinsFetcher.Singleton );    
        }
        return BitskinsFetcher.Singleton;
    } // GetSingleton()

    getName () {return this.name ;}
    setIsPopulateFinished (value) {this._is_populate_finished  = value ; }
    
    buildQuery (page_index)
    {
        var   two_FA_code      =  totp.gen(base32.decode(SECRET_BITSKINS));
        var query    = "https://bitskins.com/api/v1/get_inventory_on_sale/?api_key=" + API_KEY + "&app_id=730&code="
                        + two_FA_code + "&is_souvenir=-1&per_page=480&show_trade_delayed_items=1&page=" + page_index ;
        return query;
    } // buildQuery


    ///// https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js
    downloadPage ( url, on_response_ready ) 
    {
        var result = Konst.NOTHING;
        result = new Promise( ( resolve, reject ) => 
        {
            request( url, (error, response, body ) => 
            {
                if (error) reject(error);
                if (response != undefined && response.statusCode != 200)
                {
                    reject('Invalid status code <' + response.statusCode + '>');
                }
                else
                {
                    on_response_ready(body);
                }
                resolve(body);
            });
        });
        return result;
    }; // downloadPage()


    async fetchItems ( page_index, on_response_ready ) 
    {
        assert( on_response_ready != undefined );

        var fetch_result = Konst.NOTHING;
        
        try 
        {
            fetch_result = await this.downloadPage( this.buildQuery( page_index ), on_response_ready );
            //  console.log('SHOULD WORK:');
            // console.log (result);
        } 
        catch ( error ) 
        {
            konsole.error('ERROR:');
            konsole.error("error: " + error);
            fetch_result = error;
        }
        return Konst.NOTHING;
    } // fetchItems


    
    ///// https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js

    getExitFetchItems () { return this.exitFetchItems ; }
    
                                                                                                             
    parseOnResponseReady_CB ( json_data )
    {
        var items_count = Konst.NOTHING;
        //-------------------- Parsing du JSON -------------------
        var json_obj = { "NOTHING" : Konst.NOTHING } ;
        try 
        {
            items_count = 0;
            // console.log("Try Parsing");
            json_obj = JSON.parse( json_data.toString() );
        }
        catch( error ) 
        {
          konsole.log("BB_FETCHER.parseOnResponseReady () : Error when Parsing", LOG_LEVEL.ERROR);
          konsole.log("error code: \n" + error, LOG_LEVEL.ERROR); // error in the above string (in this case, yes)!
        } 
        //-------------------- Parsing du JSON -------------------
    
        if 
        (       json_obj['data']            != undefined  
            &&  json_obj['data']['items']   != undefined
            &&  json_obj['data']['items'].length > 0
        )
        {
            items_count = json_obj['data']['items'].length;
            konsole.log ("Items count :" + items_count, LOG_LEVEL.OK)
            konsole.log('firstItem : ' + json_obj['data']['items'][0].market_hash_name, LOG_LEVEL.MSG);
            konsole.log("page :" +json_obj['data']['page'], LOG_LEVEL.MSG)

            var singleton  = BitskinsFetcher.Singleton;
    
           //populateDB( json_obj ); 
           DBPopulater.GetSingleton().populateDBInCascade( json_obj, singleton._page_index, singleton.setIsPopulateFinished );
        }
    
        if ( items_count  == 0)
        {
            konsole.log("items_count: " + items_count, LOG_LEVEL.CRITICAL);
            this.exitFetchItems = true;
            this._is_last_page  = true;
        }
            
    
        return json_obj;
    } // parseOnResponseReady_CB()

    getIsLastPage   () { return this._is_last_page; }

    getType() 
    {
        return this.constructor.name;
    }

    async updateDb () 
    {
        db.clearTables();

        // var current_page = DBPopulater.GetSingleton().getPageIndex();
        var exit_condition = ( BitskinsFetcher.Singleton.getIsLastPage() );
        var current_page = 0;

        const check_populate_finished = async () =>
        {
            if ( this._is_populate_finished ) 
                this._page_index ++;

            else
                await pause(6000);
        };

        while ( (! exit_condition) )
        {
            konsole.log("BitskinsFetcher.updateDb():  page : " + this._page_index + " Cur page: "  + current_page, LOG_LEVEL.MSG);

            if ( this._page_index > current_page ) 
            {
                current_page = this._page_index;
                this.fetchItems( current_page, this.parseOnResponseReady_CB );
                exit_condition = ( BitskinsFetcher.Singleton.getIsLastPage() );

                await check_populate_finished();
            }
        }
            //this.updateDb()
        
    }; // updateDb ()

/*
    updateDbWithAsynk () 
    {
        db.clearTables();

        var page_index = this._page_index++;

        konsole.log("BitskinsFetcher.updateDb():  page : " + page_index, LOG_LEVEL.MSG);
        this.fetchItems( page_index, this.parseOnResponseReady_CB );


        
    
        asynk.doUntil( 
            function test(cb) 
            {   const assert            = require ('assert');
                var page_index = DBPopulater.GetSingleton().getPageIndex();
                
                if (exit_condition)
                    assert(cur_page != page_index);
                cb( null, exit_condition); 
            },

            function iter(cb) 
            {
                
                konsole.log("Traitementde la page : " + page_index, LOG_LEVEL.MSG);
                BitskinsFetcher.GetSingleton().fetchItems( page_index, BitskinsFetcher.GetSingleton().parseOnResponseReady_CB );
            },

            // End
            function (err) 
            { konsole.log("Main.updateDB() : Fin de traitement des pages (depuis: " + BB_Pop.PAGE_INDEX_START + ")", LOG_LEVEL.MSG);
            }
        ); // async.whilst()

        
    }; // updateDbWithAsynk ()
    */
    
} // BitskinsFetcher


const test = () =>
{
    var singleton = BitskinsFetcher.GetSingleton();
    konsole.log("Singleton: " + singleton.getName()  );
    //var singletwo = new BitskinsFetcher("tututt");
    BitskinsFetcher.GetSingleton().updateDb()
}

//test();


const fetchTest = () =>
{
    fetch(BitskinsFetcher.GetSingleton().buildQuery(2))
    .then(res => res.json())
    .then(json => konsole.log(JSON.stringify(json.data.items), LOG_LEVEL.STEP))

}
 //fetchTest()
exports.BitskinsFetcher = BitskinsFetcher;

