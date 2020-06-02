const asynk             = require ('async');
const assert            = require ('assert');
const request           = require('request');
const totp              = require('notp').totp;
const base32            = require('thirty-two');


const BB_Database       = require ('./bb_database.js').BB_Database;
const db                = require ('./db.js');
const Konst             = require ('./constants.js');
const konsole           = require ('./bb_log.js').konsole;
const LOG_LEVEL         = require ('./bb_log.js').LOG_LEVEL ;

const BB_Pop            = require ('./bb_populater.js');
const DBPopulater       = require ('./bb_populater.js').DBPopulater;


const SECRET_BITSKINS               = "ZW3LWWCSRIAVMVNR";
const API_KEY                       = "3c75df64-c4c1-4066-8e65-34de828dd08e";
const BITSKINS_FETCHER_SINGLETON    = "BITSKINS_FETCHER_SINGLETON";


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
        this.name = name;
        this.exitFetchItems = false;
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
        result = new Promise((resolve, reject) => 
        {
            request(url, (error, response, body) => 
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
    
           //populateDB( json_obj ); 
           DBPopulater.GetSingleton().populateDBInCascade( json_obj );
        }
    
        if (items_count == 0)
            this.exitFetchItems = true;
    
        return json_obj;
    } // parseOnResponseReady_CB()



    getType() 
    {
        return this.constructor.name;
    }

    updateDb () 
    {
        db.clearTables();

        konsole.log("BitskinsFetcher.updateDb():  page : " + DBPopulater.GetSingleton().getPageIndex(), LOG_LEVEL.MSG);
        this.fetchItems( DBPopulater.GetSingleton().getPageIndex(), this.parseOnResponseReady_CB );
      
        /*
        asynk.until( 
          function test(cb) 
          {
            cb(null, getThis().getExitFetchItems); 
          },
      
          function iter(cb) 
          {
            konsole.log("Traitementde la page : " + page_index, LOG_LEVEL.MSG);
            this.fetchItems( page_index, this.parseOnResponseReady );
            // console.log("avant pause de 6 sec");
            var page_ready = setTimeout(cb, 6000); 
            this.page_index++; // A deplacer dans BB_Populater
          },
      
          // End
          function (err) 
          {
            // All things are done!
            konsole.log("Main.updateDB() : Fin de traitement des pages (depuis: " + PAGE_INDEX_START + ")", LOG_LEVEL.MSG);
           }
        ); // async.whilst()
        */
        
    }; // updateDb ()
    

    updateDbWithAsynk () 
    {
        db.clearTables();

        var page_index = DBPopulater.Singleton.getPageIndex();

        konsole.log("BitskinsFetcher.updateDb():  page : " + page_index, LOG_LEVEL.MSG);
        this.fetchItems( page_index, this.parseOnResponseReady_CB );
    
        asynk.until( 
          function test(cb) 
          {
            cb( null, BitskinsFetcher.Singleton.getExitFetchItems() ); 
          },
      
          function iter(cb) 
          {
            page_index = DBPopulater.Singleton.getPageIndex();
            konsole.log("Traitementde la page : " + page_index, LOG_LEVEL.MSG);
            BitskinsFetcher.Singleton.fetchItems( page_index, BitskinsFetcher.Singleton.parseOnResponseReady_CB );
            // console.log("avant pause de 6 sec");
            var page_ready = setTimeout(cb, 6000); 
            //page_index++; // A deplacer dans BB_Populater
          },
      
          // End
          function (err) 
          {
            // All things are done!
            konsole.log("Main.updateDB() : Fin de traitement des pages (depuis: " + PAGE_INDEX_START + ")", LOG_LEVEL.MSG);
           }
        ); // async.whilst()

        
    }; // updateDb ()
} // BitskinsFetcher


const test = () =>
{
    var singleton = BitskinsFetcher.GetSingleton();
    konsole.log("Singleton: " + singleton.getName()  );
    //var singletwo = new BitskinsFetcher("tututt");
    BitskinsFetcher.GetSingleton().updateDbWithAsynk()
}

//test();

exports.BitskinsFetcher = BitskinsFetcher;

