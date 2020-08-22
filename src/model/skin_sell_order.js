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
    static Instances            = new Map();
    static InstancesByRecordID  = new Map();
    static NULL                 = SkinSellOrder.GetNullObject();

            // Valeur JSON
    constructor( arg, reason = Konst.Reason.None ) 
    {
        super( arg );

        this._table              = 'skin_sell_order';

        if ( arg == NULL_SKIN_SELL_ORDER ) // Cas NULL_OBJ
        {
            this.name               = NULL_SKIN_SELL_ORDER;
            this._record_id         = Konst.NULL_RECORD_ID;
            this.market_name        = Konst.NOTHING ;
            this.state              = 0;
            this.price              = NaN;
            this.recommanded_price  = NaN;  
        }
        else if ( reason == Konst.Reason.Deserialize ) // Deserialiszation
        {
            
            //console.log("Deserialize " + reason.key );
            let json_sell_order     = arg;
            //konsole.log ( 'SkinSellOrder constructeur reason = ' + reason + ' sellOrder : ' + JSON.stringify(json_sell_order), LOG_LEVEL.CRITICAL )
            this.name               = json_sell_order.item_id;
            this.market_name        = json_sell_order.market_name;
            this.state              = json_sell_order.item_state;
            this.price              = json_sell_order.price;
            this.recommanded_price  = json_sell_order.recommanded_price;  
            //this.skin_name          = Skin.ExtractName( json_sell_order);
            //this.skin_id            = Skin.GetSkin( this.skin_name).getRecordId();
            this.hasStatTrak        = json_sell_order.has_StatTrak;
            this.setRecordId( json_sell_order.id );
            //this._record_id         = json_sell_order.id;
            
            this._created_in_db     = true;

            this.setRecordId ( this._record_id );
        } 
        else if ( reason == Konst.Reason.Populate ) // Cas nominal (arg = json_data from  Bitskjins API)
        {
            let json_sell_order     = arg;
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

    getPrice() { return this.price; };

    //            optionnel
    getCoVaSeq( json_sell_order )
    { 
        let assignement_value = "`market_name` = '" + this.market_name + "', `item_state` = " + this.state  + ", `price` = " 
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


    static Get_hasStatTrak ( json_sell_order )
    {
        let tags = json_sell_order['tags'];
        let hasStatTrak = null;

        if (tags != undefined)
        {
        let quality = tags['quality'];
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
        {
            SkinSellOrder.NULL   = new SkinSellOrder( NULL_SKIN_SELL_ORDER );
            SkinSellOrder.Instances.set           ( SkinSellOrder.NULL.name, SkinSellOrder.NULL );
            SkinSellOrder.InstancesByRecordID.set ( 1, SkinSellOrder.NULL );
        }

        return SkinSellOrder.NULL;
    } // GetNullObject() 


    static GetInstances ()  {  return SkinSellOrder.Instances;  }


    // Si reason =  None        : json_data = fetch frpm Bitskins API
    //              Deserialize : json_data = { 'id': N } avec N fourni ctx.params.id dans microservice ( ex: /stella/db/skin_sell_order?id=1 )
    // PAS METTRE de ASYNC / AWAIT ça sert a R dans contexte Populate ( utilisation du NEW )
    static Create ( json_data, reason =  Konst.Reason.Populate )
    {
        assert( json_data != undefined && json_data != null, 'Create: json_data arg ' + JSON.stringify( json_data ) );


        let obj_key = null;
        if ( reason ==  Konst.Reason.Populate )
        {
            assert( json_data.item_id != undefined && json_data.item_id != null,  'Create: json_data.item_id arg ' + JSON.stringify( json_data.item_id ) );
            obj_key     = json_data.item_id ;
        }       
        else if ( reason == Konst.Reason.Deserialize )
        {
            assert( json_data.name != undefined && json_data.name != null );
            obj_key     = json_data.name ;
        }
        else { konsole.log ('SaaaaaaaaaaaallllllUUUUUUUUUUUUUUUUUUUUUUUUUUUUuuuuuuuuuuuuuuuuuuuUUUUUUUUUUUUUUUU', LOG_LEVEL.CRITICAL) }


        let sell_order_obj = SkinSellOrder.NULL ;
        let objExists   = SkinSellOrder.Instances.get ( obj_key ) != undefined;


        if ( ! objExists )
        {
            sell_order_obj = new SkinSellOrder ( json_data, reason );
            SkinSellOrder.Instances.set ( obj_key, sell_order_obj ) ;
            assert ( sell_order_obj._record_id != undefined && sell_order_obj._record_id != null )
            if ( reason == Konst.Reason.Deserialize )
                sell_order_obj.setRecordId ( sell_order_obj._record_id )
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