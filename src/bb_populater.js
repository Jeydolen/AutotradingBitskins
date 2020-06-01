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


class DBPopulater
{
    static Instances = new Map();
    static Singleton = DBPopulater.GetSingleton();

    constructor (name)
    {
        assert ( DBPopulater.Instances.size <1) ; // Singleton Design Pattern
        this.name = name;
        this.result = Konst.NOTHING;
        this.page_index = PAGE_INDEX_START;
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

    getName () {return this.name ;}
    getType () {return this.constructor.name ;}

    getPageIndex () { return this.page_index; } 


    populateDBInCascade  (json_obj) 
    { 
        assert(json_obj != undefined);

        var json_sell_orders = json_obj['data']['items'];
        var json_sell_order_count = json_sell_orders.length;

        konsole.log(" JSON Sell Order count : " + json_sell_order_count, LOG_LEVEL.MSG);

        var db = BB_Database.GetSingleton();

        var create_in_db_table_done_count = 0;
        var next_cb = Konst.NOTHING;
        
        const countCreateInDBTableDone = (klass_name) =>
        {
            create_in_db_table_done_count++;
            if ( create_in_db_table_done_count == json_sell_order_count - 1 )
            {
                create_in_db_table_done_count = 0;
                next_cb();
            }    
            konsole.log ("Je suis passé par ici name: " + klass_name + " count: " +create_in_db_table_done_count + "   next cb: " + next_cb.name, LOG_LEVEL.OK);
            konsole.error("json_sell_order_count " + json_sell_order_count);
        }; // countCreateInDBTableDone()


        const populateDBWithWeapon = () =>
        {
            create_in_db_table_done_count = 0;
            next_cb = populateDBWithSkinset_CB;
            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var weapon_obj = Weapon.Create (json_sell_orders[i]) ;
                weapon_obj.createInDBTable ( db, countCreateInDBTableDone );
            }
        }; // populateDBWithWeapon()


        const populateDBWithSkinset_CB = () =>
        {
            create_in_db_table_done_count = 0;
            next_cb = populateDBWithSkin_CB;
            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var skin_set_obj            = SkinSet.Create (json_sell_orders[i]) ;
                skin_set_obj.createInDBTable (db, countCreateInDBTableDone );
            }
        }; // populateDBWithSkinset_CB()


        const populateDBWithSkin_CB = () =>
        { 
            create_in_db_table_done_count = 0;
            next_cb = populateDBWithSkinSellOrder_CB;
            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var skin_obj            = Skin.Create (json_sell_orders[i]) ;
                skin_obj.createInDBTable (db, countCreateInDBTableDone );
            }
        }; // populateDBWithSkin_CB()


        const populateDBWithSkinSellOrder_CB = () =>
        {   
            create_in_db_table_done_count = 0;
            next_cb = populateEnd_CB;
            for (var i = 0, len = json_sell_order_count; i < len; i++) 
            {
                var skin_sell_order_obj     = SkinSellOrder.Create (json_sell_orders[i]) ;
                skin_sell_order_obj.createInDBTable (db, countCreateInDBTableDone );
            }
        }; // populateDBWithSkinSellOrder_CB()


        const populateEnd_CB = () =>
        {   
            konsole.log ("POPULATE IS FINISHED ", LOG_LEVEL.CRITICAL);
            this.page_index++;
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

test();

exports.DBPopulater = DBPopulater;
exports.PAGE_INDEX_START = PAGE_INDEX_START;
