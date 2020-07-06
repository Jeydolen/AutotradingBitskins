const assert            = require ('assert');

const Session                = rekwire ('/src/session.js').Session;
const { konsole, LOG_LEVEL } = rekwire ('/src/bb_log.js') ;
const BitskinsObject         = rekwire ('/src/model/bb_obj.js').BitskinsObject;
const Skin                   = rekwire ('/src/model/skin.js').Skin;




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
    constructor( arg) 
    {
        super(arg);
        this.table              = 'skin_sell_order';

        if (arg == NULL_SKIN_SELL_ORDER) // Cas NULL_OBJ
        {
            this.name = NULL_SKIN_SELL_ORDER;
            this.skin_id = 1;
        }
        else // Cas nominal
        {
            var json_sell_order     = arg;
            this.name               = json_sell_order.item_id.replace ("'", "''");
            this.market_name        = json_sell_order.market_hash_name.replace ("'", "''");
            this.state              = this.computeStateID (json_sell_order.float_value);
            this.price              = json_sell_order.price;
            this.recommanded_price  = json_sell_order.suggested_price;  
            this.skin_name          = Skin.ExtractName( json_sell_order);
            this.skin_id            = Skin.GetSkin( this.skin_name).getRecordId();
            this.hasStatTrak        = Skin.Get_hasStatTrak (json_sell_order);
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

    static GetNullObject() 
    {
        if (SkinSellOrder.NULL   == undefined)
            SkinSellOrder.NULL   = new SkinSellOrder( NULL_SKIN_SELL_ORDER );
        return SkinSellOrder.NULL;
    } // GetNullObject() 


    static GetInstances ()  {  return SkinSellOrder.Instances;  }


    static Create (input_item)
    {
        var sell_order_obj = SkinSellOrder.NULL ;

        var name = input_item.item_id ;


        if (SkinSellOrder.Instances.get (name) == undefined )
        {
            //konsole.log ('Détection nouvel élément: ' + name, LOG_LEVEL.OK)
            //console.log ('Détection nouvel élément: ' + name) ;
            sell_order_obj = new SkinSellOrder (input_item);
            SkinSellOrder.Instances.set (name, sell_order_obj) ;
        }
        else 
        {
            //konsole.log('Sell order déja créé (instance de SkinSellOrder): ' + name, LOG_LEVEL.WARNING)
            sell_order_obj = SkinSellOrder.Instances.get (name) ;
            sell_order_obj._is_just_created = false; 
        }
        return sell_order_obj ;
    } // Create()
} // SkinSellOrder class 
exports.SkinSellOrder = SkinSellOrder;
//-------------------- SkinSellOrder class --------------------