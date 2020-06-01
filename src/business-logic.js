const assert            = require ('assert');


const BB_Database                = require ('./bb_database.js').BB_Database;
const Konst                      = require ('./constants.js');
const konsole                    = require ('./bb_log.js').konsole;
const LOG_LEVEL                  = require ('./bb_log.js').LOG_LEVEL ;
const Skin                       = require ('./skin.js').Skin ;
const SkinSet                    = require ('./skin_set.js').SkinSet ;
const SkinSellOrder              = require ('./skin_sell_order.js').SkinSellOrder ;
const Weapon                     = require ('./weapon.js').Weapon; 

/*
$$$$$$$\                      $$\                               $$\     $$\                               
$$  __$$\                     $$ |                              $$ |    \__|                              
$$ |  $$ | $$$$$$\   $$$$$$$\ $$ | $$$$$$\   $$$$$$\  $$$$$$\ $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$$\ 
$$ |  $$ |$$  __$$\ $$  _____|$$ | \____$$\ $$  __$$\ \____$$\\_$$  _|  $$ |$$  __$$\ $$  __$$\ $$  _____|
$$ |  $$ |$$$$$$$$ |$$ /      $$ | $$$$$$$ |$$ |  \__|$$$$$$$ | $$ |    $$ |$$ /  $$ |$$ |  $$ |\$$$$$$\  
$$ |  $$ |$$   ____|$$ |      $$ |$$  __$$ |$$ |     $$  __$$ | $$ |$$\ $$ |$$ |  $$ |$$ |  $$ | \____$$\ 
$$$$$$$  |\$$$$$$$\ \$$$$$$$\ $$ |\$$$$$$$ |$$ |     \$$$$$$$ | \$$$$  |$$ |\$$$$$$  |$$ |  $$ |$$$$$$$  |
\_______/  \_______| \_______|\__| \_______|\__|      \_______|  \____/ \__| \______/ \__|  \__|\_______/ */

  




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