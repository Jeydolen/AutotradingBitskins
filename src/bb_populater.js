const assert                = require ('assert');

const BB_Database           = rekwire ('/src/bb_database.js').BB_Database;
const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL ;
const EventDispatcher       = rekwire ('/src/event_dispatcher.js').EventDispatcher;
const GUI                = rekwire ('/src/gui/GUI.js').GUI;

const Skin               = rekwire ('/src/model/skin.js').Skin ;
const SkinSet            = rekwire ('/src/model//skin_set.js').SkinSet ;
const SkinSellOrder      = rekwire ('/src/model/skin_sell_order.js').SkinSellOrder ;
const DumbItem           = rekwire ('/src/model/dumb_items.js').DumbItem ;
const Weapon             = rekwire ('/src/model/weapon.js').Weapon; 

const DB_POPULATER_SINGLETON = "DB_POPULATER_SINGLETON";

/*$$$$$$$  /$$$$$$$  /$$$$$$$                               /$$             /$$                        
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
            var done_count = this.create_in_db_done_count.get( klass );

            if ( klass == Skin || klass == DumbItem ) 
            {
                done_count = 0;
                if (this.create_in_db_done_count.get( Skin ) != undefined )
                    done_count += this.create_in_db_done_count.get( Skin );

                if (this.create_in_db_done_count.get( DumbItem ) != undefined )
                    done_count += this.create_in_db_done_count.get( DumbItem );
            }   

            assert (done_count <= json_sell_order_count, "Done count :" + done_count + " Json count: " + json_sell_order_count + " klass: " + klass.name);

            konsole.log ("DBPopulater.endOfWaterfallCB: " + bb_obj.getType()
                         + " name:" + bb_obj.getName() + " count: " + done_count + " page: " + page_index, LOG_LEVEL.OK);
            
            if ( done_count >= json_sell_order_count - 1 )
            {
                //getNextCB( getNextKlass( klass ) );
                this.next_cb();
                return;
            }

            var done_count = this.create_in_db_done_count.get( klass ) + 1;
            this.create_in_db_done_count.set ( klass, done_count );
            var values_obj = new GUI.EVT_ARGS[GUI.POPULATE_DB_PROGRESS_EVT](bb_obj.getType(), done_count, json_sell_order_count, page_index);
            EventDispatcher.GetSingleton().dispatch( GUI.EVENTS.get(GUI.POPULATE_DB_PROGRESS_EVT), values_obj );
        }; // endOfWaterfallCB()


        const populateDBWithWeapon = () =>
        {
            konsole.log("----------------------------------------------------------------------------------------", LOG_LEVEL.MSG)

            var klass = Weapon;

            this.create_in_db_done_count.clear();

            this.create_in_db_done_count.set( klass, 0 );
            this.next_cb = populateDBWithSkinSet_CB;
            
            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var weapon_obj = klass.Create (json_sell_orders[i]) ;
                weapon_obj.createInDBTable ( db, endOfWaterfallCB, json_sell_orders[i] );
            }
        }; // populateDBWithWeapon()


        const populateDBWithSkinSet_CB = () =>
        {
            var klass = SkinSet;
            
            this.create_in_db_done_count.set( klass, 0 );
            this.next_cb = populateDBWithSkinOrDumb_CB;

            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var skin_set_obj            = klass.Create (json_sell_orders[i]) ;
                skin_set_obj.createInDBTable (db, endOfWaterfallCB, json_sell_orders[i]);
            }
        }; // populateDBWithSkinset_CB()


        const populateDBWithSkinOrDumb_CB = () => // Sticker // Skin // Agent
        {
            this.next_cb = populateDBWithSkinSellOrder_CB;

            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var json_sell_order = json_sell_orders[i];

                var klass = DumbItem.ExtractType( json_sell_order );
                assert (klass != Konst.NOTHING);
                if ( this.create_in_db_done_count.get( klass) == undefined )
                    this.create_in_db_done_count.set( klass, 0 );

                var stck_skn_agt_obj = klass.Create (json_sell_order) ;
                stck_skn_agt_obj.createInDBTable (db, endOfWaterfallCB, json_sell_orders[i]);
            }
        }; // populateDBWithSkinOrDumb_CB()


        const populateDBWithSkinSellOrder_CB = () =>
        {   
            var klass = SkinSellOrder;
            this.next_cb = populateEnd_CB;
            this.create_in_db_done_count.set( klass, 0 );
            
            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var skin_sell_order_obj     = klass.Create (json_sell_orders[i]) ;
                skin_sell_order_obj.createInDBTable (db, endOfWaterfallCB, json_sell_orders[i] );
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

} // DBPopulater class


exports.DBPopulater = DBPopulater;
