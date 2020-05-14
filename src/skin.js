const assert      = require ('assert');

const Konst       = require ('./constants.js') ;
const LOG_LEVEL   = require ('./bb_log.js').LOG_LEVEL; 
const konsole     = require ('./bb_log.js').konsole ;
const BB_SqlQuery = require ('./bb_sql_query.js').BB_SqlQuery ;



                            //    /$$$$$$  /$$       /$$          
                            //   /$$__  $$| $$      |__/          
                            //  | $$  \__/| $$   /$$ /$$ /$$$$$$$ 
                            //  |  $$$$$$ | $$  /$$/| $$| $$__  $$
                            //   \____  $$| $$$$$$/ | $$| $$  \ $$
                            //   /$$  \ $$| $$_  $$ | $$| $$  | $$
                            //  |  $$$$$$/| $$ \  $$| $$| $$  | $$
                            //   \______/ |__/  \__/|__/|__/  |__/


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

  getType () 
  {
      return this.constructor.name ;
  } // getType()
  

  getName () 
  {
      // name is Enum (key, value)
      return this.name.key ;
  } // getName()

  isStored () 
  {
      return this.stored ;
  }

  //                requis
  createInDBTable ( db_obj )
  { 
    assert(db_obj != undefined);

    if (this.name == undefined)
    {
      konsole.log('Mysql error name : ' + this.name, LOG_LEVEL.ERROR);
      return Konst.RC.KO;
    } 

    if (this.stored) return Konst.RC.KO;

    // konsole.log("Skin.storeinDB() name: " + this.name, ColorConsole.LOG_LEVEL.OK );

    var name_value = this.name.replace ("'", "''");

    // INSERT INTO `skin` (name) SELECT 'Forest' FROM DUAL WHERE NOT EXISTS (SELECT name FROM skin WHERE name='Forest');
    var conditional_insert_query = "INSERT INTO `skin` (`name`) SELECT '"+ name_value + "' FROM DUAL "
                                +  "WHERE NOT EXISTS (SELECT `name` FROM `skin` WHERE `name`= '"+ name_value + "');";
               
    var query_obj = BB_SqlQuery.Create();
    var query_promise = query_obj.execute(db_obj, conditional_insert_query )
    .then( rows => 
    {
        konsole.log(query_obj.getCommand() + " successful name: "+ name_value, LOG_LEVEL.MSG);
    } );

    this.stored = true;
    return query_promise ;
  } // createInDBTable()

  updateInDB (db_obj)
  {
    assert(db_obj != undefined);

   
    var name_value = this.name.replace ("'", "''");

    var update_query = "UPDATE `skin` SET image_url ='"+ this.image_url +"' WHERE name ='"+ name_value +"' ;" ;
                
    var query_obj = BB_SqlQuery.Create();
    query_obj.execute(db_obj, update_query )
    .then( rows => 
    { konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO); });

  } // updateInDB ()

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
    assert(input_item != undefined);

    var new_skin = Skin.GetNullObject() ;

    konsole.log ('Skin.Instances : ' + Skin.Instances, LOG_LEVEL.OK );

    /*
    if ( Skin.Instances == undefined ) 
    {
        //console.log ('Skin Dictionnaire init') ;
        Skin.Instances = {} ;
    }*/

    var name = Skin.ExtractName(input_item.market_hash_name);

    // https://stackoverflow.com/questions/2591606/find-by-values-in-javascript-array
    // ** KO ** if (Skin.Instances[name] === undefined )

    konsole.log ("Recherche de: '" + name + "'", LOG_LEVEL.OK );
    konsole.log ("keys  " + Skin.Instances.keys );

    if (Skin.Instances.hasOwnProperty(name))
    {
        konsole.log ('Détection nouveau skin', LOG_LEVEL.OK) ;
        new_skin = new Skin ( input_item );
        Skin.Instances[name] = new_skin ;
        konsole.log(Skin.Instances);
    }
    else 
    {
        konsole.log ('Skin déja créé : ' + name, LOG_LEVEL.OK );
        new_skin = Skin.Instances[name] ;
        konsole.log("Skin.Create new_skin: " + new_skin);
        konsole.log("Skin.Instances: count:" +  Skin.Instances.length + " keys:" + Skin.Instances.keys);
    }

    return new_skin ;
  } // Create()
} // Skin class
Skin.Instances  = {};
Skin.NULL_SKIN ;
exports.Skin = Skin ;
//------------------------ Skin class -------------------------