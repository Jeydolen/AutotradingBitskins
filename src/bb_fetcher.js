const assert            = require ('assert');
const request           = require('request');
const totp              = require('notp').totp;
const base32            = require('thirty-two');
const fetch             = require('node-fetch');

const Singleton             = rekwire("/src/singleton.js").Singleton;
const Session               = rekwire("/src/session.js").Session;
const BB_Database           = rekwire ('/src/bb_database.js').BB_Database;
const db                    = rekwire ('/src/db.js');
const Konst                 = rekwire ('/src/constants.js');
const { konsole,LOG_LEVEL}  = rekwire ('/src/bb_log.js');
const DBPopulater           = rekwire ('/src/bb_populater.js').DBPopulater;


const SECRET_BITSKINS               = "YHY3Y2DMUOCIGROQ";
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
                                                                                                                                
class BitskinsFetcher extends Singleton
{
    static Singleton = null;
    
    constructor (args)
    {
        super (args);
        this.name                   = args;
        this.exitFetchItems         = false;
        this._is_last_page          = false;
        this._page_index            = Session.GetSingleton().getAppVar(Session.PageIndexStart) ;
        this._is_populate_finished  = false;
    } // constructor

    getName             () {return this.name ;}
    getIsLastPage       () { return this._is_last_page;   }
    getPageIndex        () { return this._page_index;     }
    getMaxPageIndex     () { return this._page_index -1;  }
    getType             () { return this.constructor.name;}
    getExitFetchItems   () { return this.exitFetchItems ; }
    setIsPopulateFinished (value) {this._is_populate_finished  = value ; }
    

    buildQuery (page_index)
    {
        var   two_FA_code      =  totp.gen(base32.decode(SECRET_BITSKINS));
        var query    = "https://bitskins.com/api/v1/get_inventory_on_sale/?api_key=" + API_KEY + "&app_id=730&code="
                        + two_FA_code + "&is_souvenir=-1&per_page=480&show_trade_delayed_items=1&page=" + page_index ;
        return query;
    } // buildQuery
    
    
    //parseOnReady_CB ( json_data,  populate_finished_cb )
    parseOnReady_CB ( json_data,  cb_args )
    {
        var populate_finished_cb    = cb_args.cb;
        var reason                  = cb_args.reason ;

        var items_count = Konst.NOTHING;
        //-------------------- Parsing du JSON -------------------
        var json_obj = { "NOTHING" : Konst.NOTHING } ;
        try 
        {
            items_count = 0;
            console.log ("Try parsing")
            json_obj = JSON.parse( json_data.toString() );
        }
        catch( error ) 
        {
          konsole.log("BB_FETCHER.parseOnReady_CB () : Error when Parsing", LOG_LEVEL.ERROR);
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
    
            if ( reason == Konst.Reason.Populate ) 
                DBPopulater.GetSingleton().populateWaterfall( json_obj, singleton._page_index++, populate_finished_cb );
            else
            {
                singleton._page_index++;
                populate_finished_cb();
            }
                
        }
    
        if ( items_count  == 0)
        {
            konsole.log (process.type, LOG_LEVEL.ERROR);
            konsole.log ("C'est qui le patron ?", LOG_LEVEL.STEP);
            BitskinsFetcher.GetSingleton().exitFetchItems = true;
            BitskinsFetcher.GetSingleton()._is_last_page  = true;
        }
        return json_obj;
    } // parseOnReady_CB()


    //====================  POPULATE_DB  ====================
    // POPULATE_DB --> FETCH_ITEMS --> DOWNLOAD_PAGE --> PARSEONREADY
    async populateDB ( page_index, reason_arg = Konst.Reason.Populate ) 
    {
        console.log('PopulateDB (bb_fetcher) Page_index :' + page_index + ' reason: ' + reason_arg)
        assert ( ! isNaN(page_index) )
        assert( reason_arg != undefined );

        if ( page_index != undefined )
            this._page_index = page_index


        if ( reason_arg == Konst.Reason.Populate)
        {
            db.clearTables();
        }  
    
        const populate_finished_cb = ( reason_arg ) =>
        {
            assert (! this._is_last_page);
            this.fetchItems( this._page_index, { cb: this.parseOnReady_CB, reason: reason_arg }, populate_finished_cb  );    
            konsole.log ("Boucle du populate: " + this._page_index, LOG_LEVEL.OK);
        }; // populate_finished_cb()

        populate_finished_cb( reason_arg );
       
    }; //==================== populateDB ()


    //====================  FETCH_ITEMS  ====================
    //async fetchItems ( page_index, on_response_ready, populate_finished_cb, reason = Konst.Reason.Populate ) 
    async fetchItems ( page_index, cb_args, populate_finished_cb ) 
    {
        var on_response_ready       = cb_args.cb;
        var reason                  = cb_args.reason ;

        assert( on_response_ready != undefined );

        var fetch_result = Konst.NOTHING;
        
        try 
        {
            fetch_result = await this.downloadPage( this.buildQuery( page_index ), cb_args, populate_finished_cb );
        } 
        catch ( error ) 
        {
            konsole.error('ERROR:');
            konsole.error("error: " + error);
            fetch_result = error;
        }
        return Konst.NOTHING;
    } //==================== FETCH_ITEMS


    ///// https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js
    downloadPage ( url, cb_args, populate_finished_cb ) 
    {
        var result = Konst.NOTHING;
        
        var on_response_ready       = cb_args.cb;
        var reason_arg              = cb_args.reason ;

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
                    on_response_ready( body,  { cb: populate_finished_cb, reason: reason_arg } ) ;
                }
                resolve(body);
            });
        });
        return result;
    }; // downloadPage()
    
    ///// https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js

} // BitskinsFetcher

exports.BitskinsFetcher = BitskinsFetcher;

