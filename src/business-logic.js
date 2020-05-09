const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const ISerializable    = require('./ISerializable.js').ISerializable;
const sql_u            = require ('./sql_utilities.js');
const BB_SqlQuery      = require ('./sql_utilities.js').BB_SqlQuery;
const Konst            = require ('./constants.js');
const konsole          = require ('./bb_log.js').konsole;

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
{   // 1) Valeur db 2) Valeur JSON
    constructor( db_obj, input_item) 
    {
        this.db_obj = db_obj ;
        this.id_str = input_item.item_id;
        this.market_name = input_item.market_hash_name;
        this.state = this.computeStateID (input_item.float_value);
        this.price = input_item.price;
        this.recommanded_price = input_item.suggested_price;
    } // constructor

    storeInDB ()
    {
        if (this.id_str == undefined)
        {
          konsole.log('business-logic.SkinSellOrder.storeinDB() : Sql error skin_sell_order.id: ' + this.id_str, LOG_LEVEL.ERROR);
          return Konst.RC.KO;
        } 

        var insert_query =   'INSERT INTO `skin_sell_order` (`id_str`, `market_name`, `item_state`) '
          + ' VALUES ( '
          +  '"'+ this.id_str + '", "' +  this.market_name + '", ' +  this.state + '  );';

        var query_obj = BB_SqlQuery.Create( this.db_obj );
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

    static Create (db_obj, input_item)
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
            sell_order = new SkinSellOrder (db_obj, input_item);
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
    constructor(db_obj, name) 
    {
        this.db_obj = db_obj ;
        this.name = name ; 
        this.stored = false;
    } // constructor

    storeInDB ()
    {
        if (this.name == undefined)
        {
            MxI.$Log.write('Skinset storeinDB() Sql error name : ' + this.name, LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        } 

        if (this.stored) return Konst.RC.KO;

        // MxI.$Log.write("SkinSet.storeinDB() name: " + this.name, ColorConsole.LOG_LEVEL.OK);

        var insert_query = "INSERT INTO `skin_set` (`name`) "
                         + "VALUES ( '" +  this.name + "'  );";
               
        var query_obj = BB_SqlQuery.Create( this.db_obj );
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


    static Create ( db_obj, input_item)
    {
        if (SkinSet.NULL_SKINSET == undefined)
            SkinSet.NULL_SKINSET = new SkinSet (null, "NOTHING");

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
                skin_set = new SkinSet (db_obj, name);
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
  constructor(db_obj, arg) 
  {      
    this.db_obj = db_obj ;
    //                      Flag       WP_name |  Skin name  (State(float_value))
    // "market_hash_name": "StatTrak™    M4A4  |  X-Ray      (Minimal Wear)",
    //console.log("Skin constructor : " + arg);

    if (arg == "NOTHING")
    {
        this.image_url = Konst.DEFAULT_NAMES.NOTHING ;
        this.hasStatTrak = false;
        this.name = Konst.DEFAULT_NAMES.NOTHING ;
        this.item_rarity = Konst.DEFAULT_NAMES.NOTHING ;
    }
    else
    {
        var input_item = arg;
        this.image_url = input_item.image ;
        this.hasStatTrak = (input_item['tags']['quality'].search("StatTrak") != -1);

        //                     ------ left ------   ---------- right ----------
        // "market_hash_name": "StatTrak™    M4A4  |  X-Ray      (Minimal Wear)",
        var market_hash_name = input_item.market_hash_name;
        // console.log("market_hash_name: '" + market_hash_name + "'");

        this.name = market_hash_name;

        if ( market_hash_name.search('|') != -1)
        {
            var parts = market_hash_name.split('|');
            if (parts.length > 1)
            {
                var right_part =  market_hash_name.split('|')[1];
             //   console.log("right_part: '" + right_part + "'");
                right_part = right_part.trim();
             // console.log("right_part trim: '" + right_part + "'");
                this.name = right_part.split(' ')[0];
            }     
        }          

        this.item_rarity = this.computeRarityID(input_item.item_rarity);
    } 

    this.stored = false;
  } // constructor()
  
  getName () 
  {
      return this.name ;
  } // getName()

  isStored () 
  {
      return this.stored ;
  }

  storeInDB ()
  { 
    if (this.name == undefined)
    {
      MxI.$Log.write ('Mysql error name : ' + this.name, LOG_LEVEL.ERROR);
      return Konst.RC.KO;
    } 

    if (this.stored) return Konst.RC.KO;

    // MxI.$Log.write("Skin.storeinDB() name: " + this.name, ColorConsole.LOG_LEVEL.OK );

    var insert_query =   "INSERT INTO `skin` (`name`) "
        + "VALUES ( '" +  this.name + "'  );";
               
    var query_obj = BB_SqlQuery.Create( this.db_obj );
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
        Skin.NULL_SKIN = new Skin (null, "NOTHING");

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

  static Create (db_connection, input_item)
  {
      if (Skin.NULL_SKIN == undefined)
          Skin.NULL_SKIN = new Skin (db_connection, "NOTHING");

      var new_skin = Skin.NULL_SKIN ;

      if ( Skin.Instances === undefined ) 
      {
          //console.log ('Skin Dictionnaire init') ;
          Skin.Instances = {} ;
      }

      //var name = input_item.tags.itemset ;
      var name = input_item ;


      if (Skin.Instances[name] === undefined )
      {
          //console.log ('Détection nouveau skin') ;
          new_skin = new Skin (db_connection, name);
          Skin.Instances[new_skin.getName()] = new_skin ;
      }
      else 
      {
         // console.log ('Skin déja créé : ' + name );
          new_skin = Skin.Instances[name] ;
      }
      return new_skin ;
  }
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