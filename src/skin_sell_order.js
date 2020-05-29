const assert            = require ('assert');

const Konst             = require ('./constants.js') ;
const LOG_LEVEL         = require ('./bb_log.js').LOG_LEVEL; 
const konsole           = require ('./bb_log.js').konsole ;
const BitskinsObject    = require ('./bb_obj.js').BitskinsObject;




/*
 /$$$$$$  /$$       /$$            /$$$$$$            /$$ /$$  /$$$$$$                  /$$                    
 /$$__  $$| $$      |__/           /$$__  $$          | $$| $$ /$$__  $$                | $$                    
| $$  \__/| $$   /$$ /$$ /$$$$$$$ | $$  \__/  /$$$$$$ | $$| $$| $$  \ $$  /$$$$$$   /$$$$$$$  /$$$$$$   /$$$$$$ 
|  $$$$$$ | $$  /$$/| $$| $$__  $$|  $$$$$$  /$$__  $$| $$| $$| $$  | $$ /$$__  $$ /$$__  $$ /$$__  $$ /$$__  $$
 \____  $$| $$$$$$/ | $$| $$  \ $$ \____  $$| $$$$$$$$| $$| $$| $$  | $$| $$  \__/| $$  | $$| $$$$$$$$| $$  \__/
 /$$  \ $$| $$_  $$ | $$| $$  | $$ /$$  \ $$| $$_____/| $$| $$| $$  | $$| $$      | $$  | $$| $$_____/| $$      
|  $$$$$$/| $$ \  $$| $$| $$  | $$|  $$$$$$/|  $$$$$$$| $$| $$|  $$$$$$/| $$      |  $$$$$$$|  $$$$$$$| $$      
 \______/ |__/  \__/|__/|__/  |__/ \______/  \_______/|__/|__/ \______/ |__/       \_______/ \_______/|__/                                                                
                                                                                                                */



class SkinSellOrder extends BitskinsObject
{               // Valeur JSON
    constructor( arg) 
    {
        super(arg)
        this.name               = arg.item_id.replace ("'", "''");
        this.market_name        = arg.market_hash_name.replace ("'", "''");
        this.state              = this.computeStateID (arg.float_value);
        this.price              = arg.price;
        this.recommanded_price  = arg.suggested_price;
        this.table              = 'skin_sell_order';
    } // constructor

    getCoVaSeq()
    { 
        var co_va_seq = "`market_name` = '" + this.market_name + "', `item_state` = " + this.state  + ", `price` = " + this.price + ", `recommanded_price` = " + this.recommanded_price ;
        return co_va_seq;
    }

    computeStateID (value) 
    {
      return  ( value < 0.07  ) ? 5 :
              ( value < 0.15  ) ? 4 :
              ( value < 0.38  ) ? 3 : 
              ( value < 0.45 )  ? 2 : 
              ( value < 1.00 )  ? 1 :
                                  0 ;
    }


    static GetInstances ()
    {
        if ( SkinSellOrder.Instances === undefined ) 
        {
          // console.log ('Skin sell order Dictionnaire init') ;
          SkinSellOrder.Instances = {} ;
        }
        return SkinSellOrder.Instances;
    }

    static Create (input_item)
    {
        var sell_order = undefined ;

        if ( SkinSellOrder.Instances === undefined ) 
        {
         // console.log ('Skin sell order Dictionnaire init') ;
            SkinSellOrder.Instances = {} ;
        }

        //var name = input_item.tags.itemset ;
        var item_name = input_item.item_id ;


        if (SkinSellOrder.Instances[item_name] == undefined )
        {
           konsole.log ('Détection nouvel élément: ' + item_name, LOG_LEVEL.OK)
            //console.log ('Détection nouvel élément: ' + item_name) ;
            sell_order = new SkinSellOrder (input_item);
            SkinSellOrder.Instances[sell_order.getName()] = sell_order ;
        }
        else 
        {
            konsole.log('Sell order déja créé (instance de SkinSellOrder): ' + item_name, LOG_LEVEL.WARNING)
            sell_order = SkinSellOrder.Instances[item_name] ;
        }
        return sell_order ;
    } // Create()
} // SkinSellOrder class 
SkinSellOrder.Instances ;
exports.SkinSellOrder = SkinSellOrder;
//-------------------- SkinSellOrder class --------------------