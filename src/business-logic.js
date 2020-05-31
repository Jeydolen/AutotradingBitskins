const assert            = require ('assert');


const BB_Database                = require ('./bb_database.js').BB_Database;
const Konst                      = require ('./constants.js');
const konsole                    = require ('./bb_log.js').konsole;
const LOG_LEVEL                  = require ('./bb_log.js').LOG_LEVEL ;
const Skin                       = require ('./skin.js').Skin ;
const SkinSet                    = require ('./skin_set.js').SkinSet ;
const SkinSellOrder              = require ('./skin_sell_order.js').SkinSellOrder ;
const Weapon                     = require ('./weapon.js').Weapon; 

var exitFetchItems = false;

/*
$$$$$$$\                      $$\                               $$\     $$\                               
$$  __$$\                     $$ |                              $$ |    \__|                              
$$ |  $$ | $$$$$$\   $$$$$$$\ $$ | $$$$$$\   $$$$$$\  $$$$$$\ $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$$\ 
$$ |  $$ |$$  __$$\ $$  _____|$$ | \____$$\ $$  __$$\ \____$$\\_$$  _|  $$ |$$  __$$\ $$  __$$\ $$  _____|
$$ |  $$ |$$$$$$$$ |$$ /      $$ | $$$$$$$ |$$ |  \__|$$$$$$$ | $$ |    $$ |$$ /  $$ |$$ |  $$ |\$$$$$$\  
$$ |  $$ |$$   ____|$$ |      $$ |$$  __$$ |$$ |     $$  __$$ | $$ |$$\ $$ |$$ |  $$ |$$ |  $$ | \____$$\ 
$$$$$$$  |\$$$$$$$\ \$$$$$$$\ $$ |\$$$$$$$ |$$ |     \$$$$$$$ | \$$$$  |$$ |\$$$$$$  |$$ |  $$ |$$$$$$$  |
\_______/  \_______| \_______|\__| \_______|\__|      \_______|  \____/ \__| \______/ \__|  \__|\_______/ */

  
const getExitFetchItems = () => {return exitFetchItems ;};

const setExitFetchItems = (value) => { exitFetchItems = value ;};

                                                                                                         

const parseOnResponseReady = ( json_data ) =>
{
    //-------------------- Parsing du JSON -------------------
    var json_obj = { "NOTHING" : Konst.NOTHING } ;
    try 
    {
        var items_count = 0;
        // console.log("Try Parsing");
        json_obj = JSON.parse(json_data.toString());
    }
    catch( error ) 
    {
      konsole.log("B_L.parseOnResponseReady () : Error when Parsing", LOG_LEVEL.ERROR);
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

       populateDB( json_obj ); 
       //populateDBInCascade( json_obj );
    }

    setExitFetchItems (items_count == 0);

    return json_obj;
} // parseOnResponseReady()


const populateDB = (json_obj) =>
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
    
}; // populateDB()


const populateDBInCascade = (json_obj) =>
{ 
    
    assert(json_obj != undefined);

    var json_sell_orders = json_obj['data']['items'];
    var json_sell_order_count = json_sell_orders.length;

    konsole.log(" JSON Sell Order count : " + json_sell_order_count, LOG_LEVEL.MSG);

    var db = BB_Database.GetSingleton();

    var create_in_db_table_done_count = 0;
    var next_cb = Konst.NOTHING;
    
    const countCreateInDBTableDone = () =>
    {
        create_in_db_table_done_count++;
        if ( create_in_db_table_done_count == json_sell_order_count - 1 )
            next_cb();
    }; // countCreateInDBTableDone()


    const populateDBWithWeapon = () =>
    {
        create_in_db_table_done_count = 0;
        next_cb = populateDBWithSkinset_CB;
        for (var i = 0, len = json_sell_order_count; i < len; i++) 
        {
            var weapon_obj = Weapon.Create (json_sell_orders[i]) ;
            weapon_obj.createInDBTable ( db, countCreateInDBTableDone);
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
    }; // populateEnd_CB()




    populateDBWithWeapon();

    return Konst.RC.OK;

} // populateDBInCascade()


//--------------------------------------------------------------
//--------------------  BusinessRule class  --------------------
//--------------------------------------------------------------
class BusinessRule 
{   
    constructor (children)
    {
        this.children = children ;
        this.checked = false;
    }

    check (args) 
    {
        this.checked = false ;    
        return this.checked ;
    }
} // BusinessRule class
//--------------------  BusinessRule class


//--------------------------------------------------------------
//--------------------  ItemsetRule class  ---------------------
//--------------------------------------------------------------
class ItemsetRule extends BusinessRule 
{
    check (args)
    {
        console.log ('type de args : ' + typeof args );
        if (! args instanceof Map)
        {
           console.log ("Starfoullah c pa une map")
           return false ;
        }
        console.log ('Reçu mon général');
    }
} // ItemsetRule class
//--------------------  ItemsetRule class


//-------------------------------------------------------------
//-------------------- SkinSellOrder class --------------------
//-------------------------------------------------------------


const test = () => 
{
    var set1 = SkinSet.Create ('bjr');
    var set2 = SkinSet.Create ('Aurevoir');
    var set3 = SkinSet.Create ('bjr');
    console.log (SkinSet.GetInstanceCount() );
}

//test();

exports.populateDB = populateDB;
exports.parseOnResponseReady = parseOnResponseReady ;
exports.getExitFetchItems = getExitFetchItems;
exports.setExitFetchItems = setExitFetchItems;