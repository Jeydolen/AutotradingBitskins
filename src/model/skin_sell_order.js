const assert            = require ('assert');

const Session                = rekwire ('/src/session.js').Session;
const { konsole, LOG_LEVEL } = rekwire ('/src/bb_log.js') ;
const BitskinsObject         = rekwire ('/src/model/bb_obj.js').BitskinsObject;
const Skin                   = rekwire ('/src/model/skin.js').Skin;
const Konst                 = rekwire ('/src/constants.js');

const NULL_SKIN_SELL_ORDER      = "NULL_SKIN_SELL_ORDER" ;



 /*$$$$$$  /$$       /$$            /$$$$$$            /$$ /$$  /$$$$$$                  /$$                    
 /$$__  $$| $$      |__/           /$$__  $$          | $$| $$ /$$__  $$                | $$                    
| $$  \__/| $$   /$$ /$$ /$$$$$$$ | $$  \__/  /$$$$$$ | $$| $$| $$  \ $$  /$$$$$$   /$$$$$$$  /$$$$$$   /$$$$$$ 
|  $$$$$$ | $$  /$$/| $$| $$__  $$|  $$$$$$  /$$__  $$| $$| $$| $$  | $$ /$$__  $$ /$$__  $$ /$$__  $$ /$$__  $$
 \____  $$| $$$$$$/ | $$| $$  \ $$ \____  $$| $$$$$$$$| $$| $$| $$  | $$| $$  \__/| $$  | $$| $$$$$$$$| $$  \__/
 /$$  \ $$| $$_  $$ | $$| $$  | $$ /$$  \ $$| $$_____/| $$| $$| $$  | $$| $$      | $$  | $$| $$_____/| $$      
|  $$$$$$/| $$ \  $$| $$| $$  | $$|  $$$$$$/|  $$$$$$$| $$| $$|  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$| $$      
 \______/ |__/  \__/|__/|__/  |__/ \______/  \_______/|__/|__/ \______/ |__/       \_______/ \_______/|_*/

class SkinSellOrder extends BitskinsObject
{               
    static Instances  = new Map();
    static NULL       = SkinSellOrder.GetNullObject();

            // Valeur JSON
    constructor( arg, reason = Konst.Reason.None ) 
    {
        super( arg );

        this.table              = 'skin_sell_order';

        console.log("reason " + reason.key );

        if (arg == NULL_SKIN_SELL_ORDER) // Cas NULL_OBJ
        {
            this.name = NULL_SKIN_SELL_ORDER;
            this.skin_id = 1;
        }
        else if ( reason == Konst.Reason.Deserialize ) // Deserialiszation
        {
            console.log("Deserialize " + reason.key );
            var json_sell_order     = arg;
            this.name               = json_sell_order.item_id;
            this.market_name        = json_sell_order.market_name;
            this.state              = json_sell_order.item_state;
            this.price              = json_sell_order.price;
            this.recommanded_price  = json_sell_order.recommanded_price;  
            //this.skin_name          = Skin.ExtractName( json_sell_order);
            //this.skin_id            = Skin.GetSkin( this.skin_name).getRecordId();
            this.hasStatTrak        =  json_sell_order.has_StatTrak;
            this._record_id         = json_sell_order.id;
            this._created_in_db     = true;
        } 
        else if ( reason == Konst.Reason.Populate ) // Cas nominal (arg = json_data from  Bitskjins API)
        {
            var json_sell_order     = arg;
            this.name               = json_sell_order.item_id.replace ("'", "''");
            this.market_name        = json_sell_order.market_hash_name.replace ("'", "''");
            this.state              = this.computeStateID (json_sell_order.float_value);
            this.price              = json_sell_order.price;
            this.recommanded_price  = json_sell_order.suggested_price;  
            this.skin_name          = Skin.ExtractName( json_sell_order);
            this.skin_id            = Skin.GetSkin( this.skin_name).getRecordId();
            this.hasStatTrak        = SkinSellOrder.Get_hasStatTrak (json_sell_order);
        }  
    } // constructor

    //            optionnel
    getCoVaSeq( json_sell_order )
    { 
        var assignement_value = "`market_name` = '" + this.market_name + "', `item_state` = " + this.state  + ", `price` = " 
                        + this.price + ", `recommanded_price` = " + this.recommanded_price + ", `skin` = " + this.skin_id ;
        if ( Session.GetSingleton().getAppVar (Session.IsProd) )  
            assignement_value += ", `has_StatTrak` = " + this.hasStatTrak;

        return assignement_value;
    }

    computeStateID (value) 
    {   return  ( value < 0.07  ) ? 5 :
                ( value < 0.15  ) ? 4 :
                ( value < 0.38  ) ? 3 : 
                ( value < 0.45 )  ? 2 : 
                ( value < 1.00 )  ? 1 :  0 ;
    } // computeStateID()

    static Get_hasStatTrak ( json_sell_order)
  {
    var tags = json_sell_order['tags'];
    var hasStatTrak = null;

    if (tags != undefined)
    {
      var quality = tags['quality'];
      if (quality != undefined)
          hasStatTrak = (quality.search("StatTrak") != -1);
    }    
    else
      hasStatTrak = false;   
    
    return hasStatTrak ? 1:0;
  } // Get_hasStatTrak


    static GetNullObject() 
    {
        if ( SkinSellOrder.NULL == undefined )
            SkinSellOrder.NULL   = new SkinSellOrder( NULL_SKIN_SELL_ORDER );
        return SkinSellOrder.NULL;
    } // GetNullObject() 


    static GetInstances ()  {  return SkinSellOrder.Instances;  }

    // Si reason =  None        : json_data = fetch frpm Bitskins API
    //              Deserialize : json_data = { 'id': N } avec N fourni ctx.params.id dans microservice ( ex: /stella/db/skin_sell_order?id=1 )
    static Create ( json_data, reason =  Konst.Reason.Populate )
    {
        var sell_order_obj = SkinSellOrder.NULL ;

        var obj_key     = json_data.item_id ;
        var objExists   = SkinSellOrder.Instances.get ( obj_key ) != undefined;

        if ( ! objExists )
        {
            sell_order_obj = new SkinSellOrder ( json_data, reason );
            SkinSellOrder.Instances.set ( obj_key, sell_order_obj) ;
        }
        else 
        {
            sell_order_obj = SkinSellOrder.Instances.get ( obj_key ) ;
            sell_order_obj._is_just_created = false; 
        }
        return sell_order_obj ;
    } // Create()
} // SkinSellOrder class 
exports.SkinSellOrder = SkinSellOrder;
//-------------------- SkinSellOrder class --------------------