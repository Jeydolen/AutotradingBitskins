"use strict";

const BB_Database                = require ('./bb_database.js').BB_Database;
const Konst                      = require ('./constants.js');
const konsole                    = require ('./bb_log.js').konsole;
const LOG_LEVEL                  = require ('./bb_log.js').LOG_LEVEL ;
const Skin                       = require ('./skin.js').Skin ;
const SkinSet                    = require ('./skin_set.js').SkinSet ;
const SkinSellOrder              = require ('./skin_sell_order.js').SkinSellOrder ;

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
    var read_items = json_obj['data']['items'];
    konsole.log("read_items: " + read_items.length, LOG_LEVEL.MSG);
    
    for (var i = 0, len = read_items.length; i < len; i++) 
    {
        // konsole.log("saveSkinSellOrders Trying tp create item( " + i + " )", LOG_LEVEL.MSG);

        /*
        //------------------ skin_set ------------------
        var skin_set          = SkinSet.Create       (read_items[i]) ;
        skin_set.storeInDB (db);
        //------------------ skin_set ------------------
        */


        //------------------ skin ------------------
        var skin              = Skin.Create          (read_items[i]) ;  
        konsole.log("skin: " + skin);  
        
        var db = BB_Database.GetSingleton();

        var query_promise = skin.createInDBTable(db);
        konsole.log("saveSkinSellOrders Trying to update Skin query_promise: " + query_promise.constructor.name );

        query_promise.then (rows => 
        {
            konsole.log("Ici aussi ca va encore\n");
            skin.updateInDB (db); 
        });
        //------------------ skin ------------------
        
        //var skin_sell_order   = SkinSellOrder.Create (read_items[i]) ;
        //skin_sell_order.storeInDB (db);
    }
    // console.log ("Number of skins saved : " + B_L.SkinSellOrder.GetInstances().length);
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