const assert      = require ('assert');

const Konst       = require ('./constants.js') ;
const LOG_LEVEL   = require ('./bb_log.js').LOG_LEVEL; 
const konsole     = require ('./bb_log.js').konsole ;
const BB_SqlQuery = require ('./bb_sql_query.js').BB_SqlQuery ;




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



class SkinSellOrder
{               // Valeur JSON
    constructor( input_item) 
    {
        this.id_str = input_item.item_id;
        this.market_name = input_item.market_hash_name;
        this.state = this.computeStateID (input_item.float_value);
        this.price = input_item.price;
        this.recommanded_price = input_item.suggested_price;
    } // constructor

    //          requis
    storeInDB ( db_obj )
    {
        //konsole.log("SkinSellOrder.storeInDB()");

        assert( db_obj != undefined );

        if (this.id_str == undefined)
        {
          konsole.log('business-logic.SkinSellOrder.storeinDB() : Sql error skin_sell_order.id: ' + this.id_str, LOG_LEVEL.ERROR);
          return Konst.RC.KO;
        } 

        var insert_query =   'INSERT INTO `skin_sell_order` (`id_str`, `market_name`, `item_state`) '
          + ' VALUES ( '
          +  '"'+ this.id_str + '", "' +  this.market_name + '", ' +  this.state + '  );';

        var query_obj = BB_SqlQuery.Create();
        query_obj.execute(db_obj, insert_query )
        .then( rows => 
        {
            // konsole.log(query_obj.getCommand() + " successful skin_sell_order", LOG_LEVEL.INFO);
        } );
    } // storeInDB()

    getName () 
    {
        return this.id_str ;
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
           // konsole.log ('Détection nouvel élément: ' + item_name, ColorConsole.LOG_LEVEL.OK)
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