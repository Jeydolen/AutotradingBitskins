const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const ISerializable    = require('./ISerializable.js').ISerializable;
const assert           = require ('assert');

const sql_u            = require ('./sql_utilities.js');
const BB_Database      = require ('./sql_utilities.js').BB_Database;
const BB_SqlQuery      = require ('./sql_utilities.js').BB_SqlQuery;
const Konst            = require ('./constants.js');
const konsole          = require ('./bb_log.js').konsole;
const LOG_LEVEL        = require ('./bb_log.js').LOG_LEVEL ;
const db               = require ('./db.js');

/*
$$$$$$$\                      $$\                               $$\     $$\                               
$$  __$$\                     $$ |                              $$ |    \__|                              
$$ |  $$ | $$$$$$\   $$$$$$$\ $$ | $$$$$$\   $$$$$$\  $$$$$$\ $$$$$$\   $$\  $$$$$$\  $$$$$$$\   $$$$$$$\ 
$$ |  $$ |$$  __$$\ $$  _____|$$ | \____$$\ $$  __$$\ \____$$\\_$$  _|  $$ |$$  __$$\ $$  __$$\ $$  _____|
$$ |  $$ |$$$$$$$$ |$$ /      $$ | $$$$$$$ |$$ |  \__|$$$$$$$ | $$ |    $$ |$$ /  $$ |$$ |  $$ |\$$$$$$\  
$$ |  $$ |$$   ____|$$ |      $$ |$$  __$$ |$$ |     $$  __$$ | $$ |$$\ $$ |$$ |  $$ |$$ |  $$ | \____$$\ 
$$$$$$$  |\$$$$$$$\ \$$$$$$$\ $$ |\$$$$$$$ |$$ |     \$$$$$$$ | \$$$$  |$$ |\$$$$$$  |$$ |  $$ |$$$$$$$  |
\_______/  \_______| \_______|\__| \_______|\__|      \_______|  \____/ \__| \______/ \__|  \__|\_______/ 
                                                                                                          */


const parseOnResponseReady = ( json_data ) =>
{
  //-------------------- Parsing des données --------------------
  //jsonData = json_data;
  //konsole.log("parseOnResponseReady " + json_data);

  var json_obj = { "NOTHING" : Konst.NOTHING } ;
  try 
  {
    var items_count = 0;
    // console.log("Try Parsing");
    json_obj = JSON.parse(json_data.toString());
    if 
    (      json_obj['data'] != undefined  
           && json_obj['data']['items'] != undefined
           && json_obj['data']['items'].length > 0
    )
    {
        items_count = json_obj['data']['items'].length;
        MxI.$Log.write('firstItem : ' + json_obj['data']['items'][0].market_hash_name, LOG_LEVEL.MSG);
        MxI.$Log.write("page :" +json_obj['data']['page'], LOG_LEVEL.MSG)

        saveSkinSellOrders( json_obj ); 
    };

    // console.log("items_count : "+ items_count);
    exitFetchItems = (items_count == 0);
  }
  catch( error ) 
  {
    konsole.log("B_L.parseOnResponseReady () : Error when Parsing", LOG_LEVEL.ERROR);
    konsole.log("error code: \n" + error, LOG_LEVEL.ERROR); // error in the above string (in this case, yes)!
  } 
  //-------------------- Parsing des données

   return json_obj;
} // parseOnResponseReady()


const saveSkinSellOrders = function (json_obj)
{
    var read_items = json_obj['data']['items'];
    konsole.log("read_items: " + read_items.length, LOG_LEVEL.MSG);
    
    for (var i = 0, len = read_items.length; i < len; i++) 
    {
        // konsole.log("saveSkinSellOrders Trying tp create item( " + i + " )", LOG_LEVEL.MSG);

        var skin            = Skin.Create          (read_items[i]) ;    
        
        /*
        var skin_set        = SkinSet.Create       (read_items[i] ) ; 
        var skin_sell_order = SkinSellOrder.Create (read_items[i] ) ;
        // skin_sell_orders.push(skin_sell_order);
        */

        // skin.storeInDB();
        
        /*
        if (skin_set != SkinSet.NULL_SKINSET)
          skin_set.storeInDB();

        skin_sell_order.storeInDB ();
        */
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
        konsole.log("SkinSellOrder.storeInDB()");

        assert( db_obj != undefined );

        if (this.id_str == undefined)
        {
          konsole.log('business-logic.SkinSellOrder.storeinDB() : Sql error skin_sell_order.id: ' + this.id_str, LOG_LEVEL.ERROR);
          return Konst.RC.KO;
        } 

        var insert_query =   'INSERT INTO `skin_sell_order` (`id_str`, `market_name`, `item_state`) '
          + ' VALUES ( '
          +  '"'+ this.id_str + '", "' +  this.market_name + '", ' +  this.state + '  );';

        var query_obj = BB_SqlQuery.Create( db_obj );
        query_obj.execute( insert_query )
        .then( rows => 
        {
            konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
        } );

      // sql_u.executeQuery (this.db_connection, insert_query);
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
           // MxI.$Log.write ('Détection nouvel élément: ' + item_name, ColorConsole.LOG_LEVEL.OK)
            //console.log ('Détection nouvel élément: ' + item_name) ;
            sell_order = new SkinSellOrder (input_item);
            SkinSellOrder.Instances[sell_order.getName()] = sell_order ;
        }
        else 
        {
            MxI.$Log.write ('Sell order déja créé : ' + item_name, LOG_LEVEL.WARNING)
            sell_order = SkinSellOrder.Instances[item_name] ;
        }
        return sell_order ;
    } // Create()

    /*save(args) 
    {
      console.log("ISerializable(SkinSellOrder).load()");
      if (! args instanceof Map)
      {
         console.log ("args c pa une map")
         return false ;
      }
    } // ISerializable.save()
    
    load(args)
    {
        console.log("ISerializable(SkinSellOrder).load()");
        if (! args instanceof Map)
        {
           console.log ("args c pa une map")
           return false ;
        }
    } // ISerializable.load() */
} // SkinSellOrder class 
SkinSellOrder.Instances ;
exports.SkinSellOrder = SkinSellOrder;
//-------------------- SkinSellOrder class --------------------


//-------------------------------------------------------------
//----------------------- SkinSet class -----------------------
//-------------------------------------------------------------
class SkinSet
{
    constructor(name) 
    {
        this.name = name ; 
        this.stored = false;
    } // constructor

    //         requis
    storeInDB (db_obj)
    {
        assert( db_obj != undefined );

        if (this.name == undefined)
        {
            MxI.$Log.write('Skinset storeinDB() Sql error name : ' + this.name, LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        } 

        if (this.stored) return Konst.RC.KO;

        // MxI.$Log.write("SkinSet.storeinDB() name: " + this.name, ColorConsole.LOG_LEVEL.OK);

        var insert_query = "INSERT INTO `skin_set` (`name`) "
                         + "VALUES ( '" +  this.name + "'  );";
               
        var query_obj = BB_SqlQuery.Create( db_obj );
        query_obj.execute( insert_query )
        .then( rows => 
        {
            konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
        } );

      //sql_u.executeQuery (this.db_connection, insert_query);

      this.stored = true;
    } // storeInDB()

    getName () 
    {
        return this.name ;
    }

    isStored () 
    {
        return this.stored ;
    }

    static GetSkinSet (name)
    {
      if (SkinSet.NULL_SKINSET == undefined)
          SkinSet.NULL_SKINSET = new SkinSet (null, "NULL");
  
      var skin_set = SkinSet.Instances[name];
      if (skin_set != undefined)
        return skin_set;
      else
        return SkinSet.NULL_SKINSET;
    } // GetSkinSet()
    
    static GetInstances ()
    {
        return SkinSet.Instances;
    }


    static Create (input_item)
    {
        konsole.log("SkinSet.Create() ", LOG_LEVEL.WARNING);

        if (SkinSet.NULL_SKINSET == undefined)
            SkinSet.NULL_SKINSET = new SkinSet (null, "NOTHING");

        if ( db_obj == undefined )
        {
            konsole.log("SkinSet.Create() db_obj undefined !!");
            return SkinSet.NULL_SKINSET;
        }

        var skin_set = SkinSet.NULL_SKINSET ;

        if ( SkinSet.Instances === undefined ) 
        {
           // console.log ('Skin set Dictionnaire init') ;
            SkinSet.Instances = {} ;
        }
      
        var name = input_item['tags']['itemset'] ;

        if (name == undefined)
            skin_set =  SkinSet.NULL_SKINSET;
        
        else 
        {
            if (SkinSet.Instances[name] == undefined )
            {
                // console.log ('Détection nouveau skin set') ;
                skin_set = new SkinSet (name);
                // MxI.$Log.write (skin_set.getName(), ColorConsole.LOG_LEVEL.MSG);
                SkinSet.Instances[name] = skin_set ;
            }
            else
            {
                MxI.$Log.write ('Skin Set déja créé : ' + name, LOG_LEVEL.ERROR);
                skin_set = SkinSet.Instances[name] ;
            }
        }

        return skin_set ;
    }
} // SkinSet class
SkinSet.Instances ;
SkinSet.NULL_SKINSET;
exports.SkinSet = SkinSet ;
//----------------------- SkinSet class -----------------------


//-------------------------------------------------------------
//------------------------ Skin class -------------------------
//-------------------------------------------------------------
class Skin 
{
  constructor( input_item ) 
  {      
    //                      Flag       WP_name |  Skin name  (State(float_value))
    // "market_hash_name": "StatTrak™    M4A4  |  X-Ray      (Minimal Wear)",
    //console.log("Skin constructor : " + arg);

    if (input_item == "NULL_SKIN")
    {
        this.image_url = Konst.DEFAULT_NAMES.NOTHING ;
        this.hasStatTrak = false;
        this.name = Konst.DEFAULT_NAMES.NOTHING ;
        this.item_rarity = Konst.DEFAULT_NAMES.NOTHING ;
    }
    else
    {  
        assert(input_item != undefined);
        //konsole.log("Skin constructor input_item != undefined");
        //konsole.log("input_item " + input_item);
        this.image_url = input_item.image ;

        var tags = input_item['tags'];

        if (tags != undefined)
        {
            var quality = tags['quality'];
            // konsole.log("quality: " + quality);
            if (quality != undefined)
                this.hasStatTrak = (quality.search("StatTrak") != -1);
        }    
        else
            this.hasStatTrak = false;

        //                     ------ left ------   ---------- right ----------
        // "market_hash_name": "StatTrak™    M4A4  |  X-Ray      (Minimal Wear)",
        this.name = Skin.ExtractName(input_item.market_hash_name);       

        this.item_rarity = this.computeRarityID(input_item.item_rarity);
    } 

    this.stored = false;
  } // constructor()


  static ExtractName(market_hash_name)
  {
    var name = market_hash_name;
    if ( market_hash_name.search('|') != -1)
    {
        var parts = market_hash_name.split('|');
        if (parts.length > 1)
        {
            var right_part =  market_hash_name.split('|')[1];
         //   console.log("right_part: '" + right_part + "'");
            right_part = right_part.trim();
         // console.log("right_part trim: '" + right_part + "'");
            name = right_part.split(' ')[0];
        }     
    }   
    return name;
  } // ExtractName()
  

  getName () 
  {
      return this.name ;
  } // getName()

  isStored () 
  {
      return this.stored ;
  }

  //          requis
  storeInDB ( db_obj )
  { 
    assert(db_obj != undefined);

    if (this.name == undefined)
    {
      MxI.$Log.write ('Mysql error name : ' + this.name, LOG_LEVEL.ERROR);
      return Konst.RC.KO;
    } 

    if (this.stored) return Konst.RC.KO;

    // MxI.$Log.write("Skin.storeinDB() name: " + this.name, ColorConsole.LOG_LEVEL.OK );

    var insert_query =   "INSERT INTO `skin` (`name`) "
        + "VALUES ( '" +  this.name + "'  );";
               
    var query_obj = BB_SqlQuery.Create();
    query_obj.execute( insert_query )
    .then( rows => 
    {
        konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
    } );

    //sql_u.executeQuery (this.db_connection, insert_query);

    this.stored = true;
  } // storeInDB()


  static GetSkin (name)
  {
    if (Skin.NULL_SKIN == undefined)
        Skin.NULL_SKIN = new Skin (Konst.NOTHING.toString());

    var skin = Skin.Instances[name];
    if (skin != undefined)
      return skin;
    else
      return Skin.NULL_SKIN;
  } // GetSkin()
  
  static GetInstanceCount  ()
  {
      var instance_count = Object.keys(Skin.Instances).length ; 
      return instance_count;
  }

  computeRarityID (value)
  {
    return  ( value == 'Contraband'  )        ? 7 :
            ( value == 'Covert'  )            ? 6 :
            ( value == 'Classified'  )        ? 5 : 
            ( value == 'Restricted' )         ? 4 : 
            ( value == 'Mil-Spec Grade' )     ? 3 :
            ( value == 'Industrial Grade' )   ? 2 :
            ( value == 'Consumer Grade' )     ? 1 :
                                                0 ;
  }

  static GetNullObject() 
  {
    if (Skin.NULL_SKIN == undefined)
        Skin.NULL_SKIN = new Skin( "NULL_SKIN");
      return Skin.NULL_SKIN;
  } // GetNullObject() 

  static Create ( input_item )
  {
    //konsole.log("Skin.Create()", LOG_LEVEL.WARNING);

    var new_skin = Skin.GetNullObject() ;

    if ( Skin.Instances === undefined ) 
    {
        //console.log ('Skin Dictionnaire init') ;
        Skin.Instances = {} ;
    }

    var name = Skin.ExtractName(input_item.market_hash_name);

    if (Skin.Instances[name] === undefined )
    {
        //console.log ('Détection nouveau skin') ;
        new_skin = new Skin ( input_item );
        Skin.Instances[name] = new_skin ;
    }
    else 
    {
        // console.log ('Skin déja créé : ' + name );
        new_skin = Skin.Instances[input_item] ;
    }

    return new_skin ;
  } // Create()
} // Skin class
Skin.Instances ;
Skin.NULL_SKIN ; 
exports.Skin = Skin ;
//------------------------ Skin class -------------------------

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