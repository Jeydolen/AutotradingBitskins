const assert             = require ('assert');


const BB_Database        = require ('./bb_database.js').BB_Database;
const Konst              = require ('./constants.js');
const konsole            = require ('./bb_log.js').konsole;
const LOG_LEVEL          = require ('./bb_log.js').LOG_LEVEL ;
const Skin               = require ('./skin.js').Skin ;
const SkinSet            = require ('./skin_set.js').SkinSet ;
const SkinSellOrder      = require ('./skin_sell_order.js').SkinSellOrder ;
const Weapon             = require ('./weapon.js').Weapon; 
const Agent              = require ('./agent.js').Agent; 
const Sticker            = require ('./sticker.js').Sticker; 

const DB_POPULATER_SINGLETON = "DB_POPULATER_SINGLETON";

//______________________________________________________________________
const PAGE_INDEX_START = 2; //----------------------------------------
//______________________________________________________________________


/*
 /$$$$$$$  /$$$$$$$  /$$$$$$$                               /$$             /$$                        
| $$__  $$| $$__  $$| $$__  $$                             | $$            | $$                        
| $$  \ $$| $$  \ $$| $$  \ $$ /$$$$$$   /$$$$$$  /$$   /$$| $$  /$$$$$$  /$$$$$$    /$$$$$$   /$$$$$$ 
| $$  | $$| $$$$$$$ | $$$$$$$//$$__  $$ /$$__  $$| $$  | $$| $$ |____  $$|_  $$_/   /$$__  $$ /$$__  $$
| $$  | $$| $$__  $$| $$____/| $$  \ $$| $$  \ $$| $$  | $$| $$  /$$$$$$$  | $$    | $$$$$$$$| $$  \__/
| $$  | $$| $$  \ $$| $$     | $$  | $$| $$  | $$| $$  | $$| $$ /$$__  $$  | $$ /$$| $$_____/| $$      
| $$$$$$$/| $$$$$$$/| $$     |  $$$$$$/| $$$$$$$/|  $$$$$$/| $$|  $$$$$$$  |  $$$$/|  $$$$$$$| $$      
|_______/ |_______/ |__/      \______/ | $$____/  \______/ |__/ \_______/   \___/   \_______/|__/      
                                       | $$                                                            
                                       | $$                                                            
                                       |_*/      

class DBPopulater
{
    static Instances = new Map();
    static Singleton = DBPopulater.GetSingleton();

    constructor (name)
    {
        assert ( DBPopulater.Instances.size <1) ; // Singleton Design Pattern
        this.name = name;
        this.result = Konst.NOTHING;
        this.create_in_db_done_count = new Map();
        this.next_cb = Konst.NOTHING;
    } // constructor


    static GetSingleton()
    {
        if (DBPopulater.Singleton == undefined)
        {
            DBPopulater.Singleton = new DBPopulater( DB_POPULATER_SINGLETON ) ;
            DBPopulater.Instances.set ( DB_POPULATER_SINGLETON, DBPopulater.Singleton );    
        }
        return DBPopulater.Singleton;
    } // GetSingleton()

    getName         () { return this.name ; }
    getType         () { return this.constructor.name; }

    


    populateWaterfall ( json_obj, page_index, populate_finished_cb ) 
    { 
        assert( json_obj != undefined );

        var json_sell_orders = json_obj['data']['items'];
        var json_sell_order_count = json_sell_orders.length;

        konsole.log(" JSON Sell Order count : " + json_sell_order_count, LOG_LEVEL.MSG);

        var db = BB_Database.GetSingleton();


        const getNextCB = ( klass ) =>
        {
            return  ( klass == SkinSellOrder )   ?  populateEnd_CB :
                                                    populateDBWithKlassInstances ;
        } // getNextgetNextCB()


        const getNextKlass = ( klass ) =>
        {
            return  ( klass == Weapon   )   ?   SkinSet         :
                    ( klass == SkinSet  )   ?   Skin            : 
                    ( klass == Skin     )   ?   SkinSellOrder   : 
                                                Weapon          ;
        } // getNextKlass()
        
        
        // Compte les query finies pour la page courante
        const endOfWaterfallCB = ( bb_obj ) => 
        {
            assert( bb_obj != undefined );

            var klass = (bb_obj.constructor);
            //konsole.log (klass.name, LOG_LEVEL.CRITICAL);

            var done_count = this.create_in_db_done_count.get( klass );

            assert (done_count <= json_sell_order_count, "Done count :" + done_count + " Json count: " + json_sell_order_count + " klass: " + klass.name);

            konsole.log ("DBPopulater.endOfWaterfallCB: " + bb_obj.getType()
                         + " name:" + bb_obj.getName() + " count: " + done_count + " page: " + page_index, LOG_LEVEL.OK);
            
            if ( done_count >= json_sell_order_count - 1 )
            {
                //getNextCB( getNextKlass( klass ) );
                this.next_cb();
                return;
            }

            this.create_in_db_done_count.set ( klass, done_count + 1 );
        }; // endOfWaterfallCB()

        /*
        //                                     requis     optionnel
        const populateDBWithKlassInstances = ( klass,  waterfall_start ) =>
        {
            assert( klass != undefined );
            konsole.log("----------------------------------------------------------------------------------------", LOG_LEVEL.MSG)

            konsole.error("create_in_db_done_count: " + this.create_in_db_done_count.get( klass ));

            //this.next_cb = populateDBWithSkinSet_CB;

            if ( waterfall_start )
                this.create_in_db_done_count.clear(); // Efface  toutes les clés
            
            this.create_in_db_done_count.set( klass, 0 );

            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var weapon_obj = klass.Create (json_sell_orders[i]) ;
                weapon_obj.createInDBTable ( db, endOfWaterfallCB );
            }
        }; // populateDBWithKlassInstances()
        */


        const populateDBWithWeapon = () =>
        {
            konsole.log("----------------------------------------------------------------------------------------", LOG_LEVEL.MSG)

            var klass = Weapon;
            konsole.error("create_in_db_done_count: " + this.create_in_db_done_count.get(klass));

            this.create_in_db_done_count.clear();

            this.create_in_db_done_count.set( klass, 0 );
            this.next_cb = populateDBWithSkinSet_CB;
            
            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var weapon_obj = klass.Create (json_sell_orders[i]) ;
                weapon_obj.createInDBTable ( db, endOfWaterfallCB );
            }
        }; // populateDBWithWeapon()


        const populateDBWithSkinSet_CB = () =>
        {
            var klass = SkinSet;
            
            this.create_in_db_done_count.set( klass, 0 );
            this.next_cb = populateDBWith_Stck_Skn_Agt_CB;

            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var skin_set_obj            = klass.Create (json_sell_orders[i]) ;
                skin_set_obj.createInDBTable (db, endOfWaterfallCB);
            }
        }; // populateDBWithSkinset_CB()


        const populateDBWith_Stck_Skn_Agt_CB = () => // Sticker // Skin // Agent
        {
            this.next_cb = populateDBWithSkinSellOrder_CB;

            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var input_item = json_sell_orders[i];

                var klass = SkinSellOrder.ExtractType( input_item );
                assert (klass != Konst.NOTHING);
                if ( this.create_in_db_done_count.get( klass) == undefined )
                    this.create_in_db_done_count.set( klass, 0 );

                var stck_skn_agt_obj = klass.Create (input_item) ;
                stck_skn_agt_obj.createInDBTable (db, endOfWaterfallCB);
            }
        }; // populateDBWithSticker_CB()


        const populateDBWithSkinSellOrder_CB = () =>
        {   
            var klass = SkinSellOrder;
            this.next_cb = populateEnd_CB;
            this.create_in_db_done_count.set( klass, 0 );
            
            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var skin_sell_order_obj     = klass.Create (json_sell_orders[i]) ;
                skin_sell_order_obj.createInDBTable (db, endOfWaterfallCB );
            }
        }; // populateDBWithSkinSellOrder_CB()


        const populateEnd_CB = () =>
        {   
            konsole.log ("POPULATE IS FINISHED FOR PAGE: " + page_index, LOG_LEVEL.OK);
            populate_finished_cb();
        }; // populateEnd_CB()
        

        populateDBWithWeapon(); // Waterfall start
        //populateDBWithKlassInstances(Weapon); // Waterfall start
    } // populateWaterfall() 

    
    populateDB(json_obj)
    {
        var json_sell_orders = json_obj['data']['items'];
        var json_sell_order_count = json_sell_orders.length;

        konsole.log(" JSON Sell Order count : " + json_sell_order_count, LOG_LEVEL.MSG);

        var db = BB_Database.GetSingleton();

    

        for (var i = 0, len = json_sell_order_count; i < len; i++) 
        {

            //------------------ skin_set ------------------
            var skin_set_obj            = SkinSet.Create (json_sell_orders[i]) ;
            skin_set_obj.createInDBTable (db);
            //------------------ skin_set ------------------


            //------------------ weapon ------------------
            var weapon_obj     = Weapon.Create (json_sell_orders[i]) ;
            weapon_obj.createInDBTable (db);
            //------------------ weapon ------------------


            //------------------ skin ------------------
            var skin_obj                = Skin.Create   (json_sell_orders[i]) ;  
            skin_obj.createInDBTable(db);
            //------------------ skin ------------------
            

            //------------------ skin_sell_order ------------------
            var skin_sell_order_obj     = SkinSellOrder.Create (json_sell_orders[i]) ;
            skin_sell_order_obj.createInDBTable (db);
            //------------------ skin_sell_order ------------------
        } // for (CREATE)
    } // populateDB()

} // DBPopulater class

const test = () =>
{
    var singleton = DBPopulater.GetSingleton();
    konsole.log("Singleton: " + singleton.getName()  );
    //var singletwo = new DBPopulater("tututt");
}

//test();

exports.DBPopulater = DBPopulater;
exports.PAGE_INDEX_START = PAGE_INDEX_START;
