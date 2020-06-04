const assert             = require ('assert');


const BB_Database        = require ('./bb_database.js').BB_Database;
const Konst              = require ('./constants.js');
const konsole            = require ('./bb_log.js').konsole;
const LOG_LEVEL          = require ('./bb_log.js').LOG_LEVEL ;
const Skin               = require ('./skin.js').Skin ;
const SkinSet            = require ('./skin_set.js').SkinSet ;
const SkinSellOrder      = require ('./skin_sell_order.js').SkinSellOrder ;
const Weapon             = require ('./weapon.js').Weapon; 


const DB_POPULATER_SINGLETON = "DB_POPULATER_SINGLETON";

//______________________________________________________________________
const PAGE_INDEX_START = 90; //----------------------------------------
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
        this._page_index    = PAGE_INDEX_START;
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
    getPageIndex    () { return this._page_index; }


    populateDBInCascade ( json_obj ) 
    { 
        assert( json_obj != undefined );

        var json_sell_orders = json_obj['data']['items'];
        var json_sell_order_count = json_sell_orders.length;

        konsole.log(" JSON Sell Order count : " + json_sell_order_count, LOG_LEVEL.MSG);

        var db = BB_Database.GetSingleton();
        

        const countCreateInDBTableDone = ( bb_obj ) =>
        {
            assert( bb_obj != undefined );

            var klass = (bb_obj.constructor);
            //konsole.log (klass.name, LOG_LEVEL.CRITICAL);

            var done_count = this.create_in_db_done_count.get( klass );

            assert (done_count <= json_sell_order_count);

            konsole.log ("DBPopulater.countCreateInDBTableDone: " + bb_obj.getType()
                         + " name:" + bb_obj.getName() + " count: " + done_count + " page: " + this._page_index, LOG_LEVEL.OK);
            
            this.create_in_db_done_count.set ( klass, done_count + 1 );

            if ( done_count >= json_sell_order_count -1 )
                this.next_cb();
        }; // countCreateInDBTableDone()


        const populateDBWithWeapon = () =>
        {
            konsole.log("----------------------------------------------------------------------------------------", LOG_LEVEL.MSG)

            var klass = Weapon;
            konsole.error("create_in_db_done_count: " + this.create_in_db_done_count.get(klass));

            this.next_cb = populateDBWithSkinSet_CB;
            this.create_in_db_done_count.clear(); // Efface  toutes les clés
            this.create_in_db_done_count.set( klass, 0 );

            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var weapon_obj = klass.Create (json_sell_orders[i]) ;
                weapon_obj.createInDBTable ( db, countCreateInDBTableDone );
            }
        }; // populateDBWithWeapon()


        const populateDBWithSkinSet_CB = () =>
        {
            var klass = SkinSet;
            this.next_cb = populateDBWithSkin_CB;
            this.create_in_db_done_count.set( klass, 0 );

            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var skin_set_obj            = klass.Create (json_sell_orders[i]) ;
                skin_set_obj.createInDBTable (db, countCreateInDBTableDone );
            }
        }; // populateDBWithSkinset_CB()


        const populateDBWithSkin_CB = () =>
        { 
            var klass = Skin;
            this.next_cb = populateDBWithSkinSellOrder_CB;
            this.create_in_db_done_count.set( klass, 0 );
            
            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var skin_obj            = klass.Create (json_sell_orders[i]) ;
                skin_obj.createInDBTable (db, countCreateInDBTableDone );
            }
        }; // populateDBWithSkin_CB()


        const populateDBWithSkinSellOrder_CB = () =>
        {   
            var klass = SkinSellOrder;
            this.next_cb = populateEnd_CB;
            this.create_in_db_done_count.set( klass, 0 );
            
            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var skin_sell_order_obj     = klass.Create (json_sell_orders[i]) ;
                skin_sell_order_obj.createInDBTable (db, countCreateInDBTableDone );
            }
        }; // populateDBWithSkinSellOrder_CB()


        const populateEnd_CB = () =>
        {   
            konsole.log ("POPULATE IS FINISHED ", LOG_LEVEL.OK);
            this._page_index++;
        }; // populateEnd_CB()


        
        populateDBWithWeapon();
    } // populateDBInCascade()

    
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
