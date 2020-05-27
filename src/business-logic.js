"use strict";

const BB_Database                = require ('./bb_database.js').BB_Database;
const Konst                      = require ('./constants.js');
const konsole                    = require ('./bb_log.js').konsole;
const LOG_LEVEL                  = require ('./bb_log.js').LOG_LEVEL ;
const Skin                       = require ('./skin.js').Skin ;
const SkinSet                    = require ('./skin_set.js').SkinSet ;
const SkinSellOrder              = require ('./skin_sell_order.js').SkinSellOrder ;
const pause                       = require ('./utility.js').pause;

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

        saveSkinSellOrders( json_obj ); 
    };

    setExitFetchItems (items_count == 0);

    return json_obj;
} // parseOnResponseReady()


const saveSkinSellOrders = function (json_obj)
{
    var json_sell_orders = json_obj['data']['items'];
    var json_sell_order_count = json_sell_orders.length;

    konsole.log(" JSON Sell Order count : " + json_sell_order_count, LOG_LEVEL.MSG);

    var db = BB_Database.GetSingleton();

    var skins_create_query_count = 0;
    var created_skins_count      = 0;

    for (var i = 0, len = json_sell_order_count; i < len; i++) 
    {
        // konsole.log("saveSkinSellOrders Trying tp create item( " + i + " )", LOG_LEVEL.MSG);
        konsole.log(" JSON Sell Order skins_create_query_count : " + skins_create_query_count, LOG_LEVEL.MSG);

        /* //------------------ skin_set ------------------
        var skin_set          = SkinSet.Create       (json_sell_orders[i]) ;
        skin_set.storeInDB (db);
        //------------------ skin_set ------------------*/


        //------------------ skin ------------------
        var skin_obj = Skin.Create( json_sell_orders[i] ) ;  
        skin_obj.createInDBTable(db);
        //------------------ skin ------------------
        

        //------------------ skin_sell_order ------------------
        //var skin_sell_order   = SkinSellOrder.Create (json_sell_orders[i]) ;
        //skin_sell_order.storeInDB (db);
        //------------------ skin_sell_order ------------------
    } // for (CREATE)
    
    
    var updated_instances = 0;

    return;

   while (updated_instances < Skin.GetInstanceCount() )
    {
        pause (6000);
        for (var i = 0, len = json_sell_orders.length; i < len; i++) 
        {
            
            // konsole.log("saveSkinSellOrders Trying tp create item( " + i + " )", LOG_LEVEL.MSG);

            /* //------------------ skin_set ------------------
            var skin_set          = SkinSet.Create       (json_sell_orders[i]) ;
            skin_set.storeInDB (db);
            //------------------ skin_set ------------------*/


            //------------------ skin ------------------
            var skin_obj = Skin.Create( json_sell_orders[i] ) ;  
            
            if ( skin_obj.getIsUpdatedInDB () )
                updated_instances += 1 ;

            else  
            {   pause (100);
                skin_obj.updateInDB     (db);
            }
            
            //------------------ skin ------------------
            
            //------------------ skin_sell_order ------------------
            //var skin_sell_order   = SkinSellOrder.Create (json_sell_orders[i]) ;
            //skin_sell_order.storeInDB (db);
            //------------------ skin_sell_order ------------------

        } // for ()
    } // while()
    
}; // saveSkinSellOrders()

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

exports.saveSkinSellOrders = saveSkinSellOrders;
exports.parseOnResponseReady = parseOnResponseReady ;
exports.getExitFetchItems = getExitFetchItems;
exports.setExitFetchItems = setExitFetchItems;