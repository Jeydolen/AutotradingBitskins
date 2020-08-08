const assert                = require ('assert');

const BB_Database           = rekwire ('/src/bb_database.js').BB_Database;
const Konst                 = rekwire ('/src/constants.js');
const { konsole, LOG_LEVEL} = rekwire ('/src/bb_log.js');
const EventDispatcher       = rekwire ('/src/event_dispatcher.js').EventDispatcher;
const GUI                   = rekwire ('/src/gui/GUI.js').GUI;
const Singleton             = rekwire ('/src/singleton.js').Singleton;

const Skin                  = rekwire ('/src/model/skin.js').Skin ;
const SkinSet               = rekwire ('/src/model/skin_set.js').SkinSet ;
const SkinSellOrder         = rekwire ('/src/model/skin_sell_order.js').SkinSellOrder ;
const DumbItem              = rekwire ('/src/model/dumb_items.js').DumbItem ;
const Weapon                = rekwire ('/src/model/weapon.js').Weapon; 

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

class DBPopulater extends Singleton
{
    static Instances = new Map();
    static Singleton = DBPopulater.GetSingleton();

    constructor (args)
    {
        super (args)
        assert ( DBPopulater.Instances.size <1) ; // Singleton Design Pattern
        this.name = args;
        this.result = Konst.NOTHING;
        this.create_in_db_done_count = new Map();
        this.next_cb = Konst.NOTHING;
    } // constructor

    getName         () { return this.name ; }
    getType         () { return this.constructor.name; }

    populateWaterfall ( json_obj, page_index, populate_finished_cb ) 
    { 
        assert( json_obj != undefined );

        let json_sell_orders = json_obj['data']['items'];
        let json_sell_order_count = json_sell_orders.length;

        konsole.log(" JSON Sell Order count : " + json_sell_order_count, LOG_LEVEL.MSG);

        let db = BB_Database.GetSingleton();


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

            let klass = (bb_obj.constructor);
            let done_count = this.create_in_db_done_count.get( klass );

            if ( klass == Skin || klass == DumbItem ) 
            {
                done_count = 0;
                if (this.create_in_db_done_count.get( Skin ) != undefined )
                    done_count += this.create_in_db_done_count.get( Skin );

                if (this.create_in_db_done_count.get( DumbItem ) != undefined )
                    done_count += this.create_in_db_done_count.get( DumbItem );
            }   

            assert (done_count <= json_sell_order_count, "Done count :" + done_count + " Json count: " + json_sell_order_count + " klass: " + klass.name);

            konsole.log ( bb_obj.getType() + " name: '" + bb_obj.getName() + "' count: " 
                        + done_count + " page: " + page_index, LOG_LEVEL.OK
                        );
            
            if ( done_count >= json_sell_order_count - 1 )
            {
                //getNextCB( getNextKlass( klass ) );
                this.next_cb();
                return;
            }

            done_count = this.create_in_db_done_count.get( klass ) + 1;
            this.create_in_db_done_count.set ( klass, done_count );
            let values_obj = new GUI.EVT_ARGS[GUI.POPULATE_DB_PROGRESS_EVT](bb_obj.getType(), done_count, json_sell_order_count, page_index);
            EventDispatcher.GetSingleton().dispatch( GUI.EVENT.get(GUI.POPULATE_DB_PROGRESS_EVT), values_obj );
            //EventDispatcher.GetSingleton().dispatch( GUI.EVENT[GUI.POPULATE_DB_PROGRESS_EVT], values_obj );
        }; // endOfWaterfallCB()


        const populateDBWithWeapon = () =>
        {
            konsole.log("----------------------------------------------------------------------------------------", LOG_LEVEL.MSG)

            let klass = Weapon;

            this.create_in_db_done_count.clear();

            this.create_in_db_done_count.set( klass, 0 );
            this.next_cb = populateDBWithSkinSet_CB;
            
            for (let i = 0, len = json_sell_order_count; i < len; i++) 
            {
                let weapon_obj = klass.Create (json_sell_orders[i]) ;
                weapon_obj.createInDBTable ( endOfWaterfallCB, json_sell_orders[i] );
            }
        }; // populateDBWithWeapon()


        const populateDBWithSkinSet_CB = () =>
        {
            let klass = SkinSet;
            
            this.create_in_db_done_count.set( klass, 0 );
            this.next_cb = populateDBWithSkinOrDumb_CB;

            for (let i = 0, len = json_sell_order_count; i < len; i++) 
            {
                let skin_set_obj            = klass.Create (json_sell_orders[i]) ;
                skin_set_obj.createInDBTable ( endOfWaterfallCB, json_sell_orders[i]);
            }
        }; // populateDBWithSkinset_CB()


        const populateDBWithSkinOrDumb_CB = () => // Sticker // Skin // Agent
        {
            this.next_cb = populateDBWithSkinSellOrder_CB;

            for (let i = 0, len = json_sell_order_count; i < len; i++) 
            {
                let json_sell_order = json_sell_orders[i];

                let klass = DumbItem.ExtractType( json_sell_order );
                assert (klass != Konst.NOTHING);
                if ( this.create_in_db_done_count.get( klass) == undefined )
                    this.create_in_db_done_count.set( klass, 0 );

                let skin_or_dumb_obj = klass.Create (json_sell_order) ;
                skin_or_dumb_obj.createInDBTable ( endOfWaterfallCB, json_sell_orders[i]);
            }
        }; // populateDBWithSkinOrDumb_CB()


        const populateDBWithSkinSellOrder_CB = () =>
        {   
            let klass = SkinSellOrder;
            this.next_cb = populateEnd_CB;
            this.create_in_db_done_count.set( klass, 0 );
            
            for (let i = 0, len = json_sell_order_count; i < len; i++) 
            {
                let skin_sell_order_obj     = klass.Create ( json_sell_orders[i] ) ;
                skin_sell_order_obj.createInDBTable ( endOfWaterfallCB, json_sell_orders[i] );
            }
        }; // populateDBWithSkinSellOrder_CB()


        const populateEnd_CB = () =>
        {   
            konsole.log ("POPULATE IS FINISHED FOR PAGE: " + page_index, LOG_LEVEL.OK);
            populate_finished_cb();
        }; // populateEnd_CB()
        

        populateDBWithWeapon(); // Waterfall start
    } // populateWaterfall() 

} // DBPopulater class


exports.DBPopulater = DBPopulater;
