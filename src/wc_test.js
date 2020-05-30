const assert      = require ('assert');

const LOG_LEVEL   = require ('./bb_log.js').LOG_LEVEL; 
const konsole     = require ('./bb_log.js').konsole ;


const BitskinsObject  = require ('./bb_obj.js').BitskinsObject;


const NULL_SKIN   = "NULL_SKIN" ;
const NULL_URL    = "http://NULL_URL";
const NULL_RARITY = "Unknown"; // M^mem valeur que dans la Table de constantes 'skin_rarity'



/*
 /$$      /$$  /$$$$$$        /$$$$$$$$                    /$$    
| $$  /$ | $$ /$$__  $$      |__  $$__/                   | $$    
| $$ /$$$| $$| $$  \__/         | $$  /$$$$$$   /$$$$$$$ /$$$$$$  
| $$/$$ $$ $$| $$               | $$ /$$__  $$ /$$_____/|_  $$_/  
| $$$$_  $$$$| $$               | $$| $$$$$$$$|  $$$$$$   | $$    
| $$$/ \  $$$| $$    $$         | $$| $$_____/ \____  $$  | $$ /$$
| $$/   \  $$|  $$$$$$/         | $$|  $$$$$$$ /$$$$$$$/  |  $$$$/
|__/     \__/ \______/          |__/ \_______/|_______/    \___/   */

class WCTest extends BitskinsObject
{
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes/Class_fields
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Map
  static Instances  = new Map();

  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( arg ) 
  {
    super (arg)    ;  
    //                      Flag       WP_name |  Skin name  (State(float_value))
    // "market_hash_name": "StatTrak™    M4A4  |  X-Ray      (Minimal Wear)",
    //console.log("Skin constructor : " + arg);

    if ( arg == NULL_SKIN )
    {
      // Cas particulier: instanciation du NullObject (cf. Design Patterns)
      this.name         = NULL_SKIN ;
      this.image_url    = NULL_URL ;
      this.hasStatTrak  = false;
      this.item_rarity  = NULL_RARITY ;
    }
    else
    {  
      // Cas nominal: instance != Skin.NULL_SKIN
      var input_item = arg;
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
      this.name = "tututt";
      this.name           = Skin.ExtractName(input_item.market_hash_name); 
      this.item_rarity    = this.computeRarityID(input_item.item_rarity);
      this.table          = 'skin';
    } // if (arg == NULL_SKIN)I

  } // constructor()

  getCoVaSeq () 
  { 
    var assignement_value = "`image_url` = '" + this.image_url + "', `has_StatTrak` = " + this.hasStatTrak + ", `skin_rarity` = " + this.item_rarity ;
    return assignement_value;
  }

  static ExtractName( market_hash_name )
  {
    //konsole.log("Skin.ExtractName market_hash_name: '" + market_hash_name + "'", LOG_LEVEL.MSG)
    var name = market_hash_name;
    if ( market_hash_name.search('|') != -1)
    {
      //konsole.log("Skin.ExtractName '|' trouvée", LOG_LEVEL.MSG);

      var parts = market_hash_name.split('|');

      if (parts.length > 1)
      {
        var right_part =  market_hash_name.split('|')[1];
        right_part = right_part.trim();
        name = right_part.split('(')[0].trim(' ');

        // !!! Probléme: ' dans la valeur SQL de chaine ex: 'l'Horizon' -> 'l''Horizon'
        // !!! Solution: escape de ' rempacé par ''
        name = name.replace ("'", "''");
      } 

    }
    //konsole.log("Skin.ExtractName name: '" + name + "'", LOG_LEVEL.MSG)
    return name;
  } // ExtractName()


  static GetSkin ( name )
  {
    Skin.GetNullObject(); // Crée le Null Object si pas déjà créé

    var found_skin = Skin.Instances.get(name); // Map !!
    if (found_skin != undefined)
      return found_skin;
    else
      return Skin.NULL_SKIN;
  } // GetSkin()
  

  static GetInstanceCount  ()
  {
      var instance_count = Skin.Instances.size ;  // Map !!
      //konsole.log("Skin.GetInstanceCount:" + instance_count, LOG_LEVEL.CRITICAL);
      return instance_count;
  } // GetInstanceCount()


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
  } // computeRarityID()


  static GetNullObject() 
  {
    if (Skin.NULL_SKIN == undefined)
    {
      Skin.NULL_SKIN = new Skin( NULL_SKIN );
      Skin.Instances.set( NULL_SKIN, Skin.NULL_SKIN );
    }
    return Skin.NULL_SKIN;
  } // GetNullObject() 


  // Encapsulation du constructeur selon Design Pattern 'Factory'
  static Create ( input_item )
  {
    //konsole.log("Skin.Create()", LOG_LEVEL.WARNING);
    assert(input_item != undefined);

    var new_skin = Skin.GetNullObject() ;

    var name = Skin.ExtractName( input_item.market_hash_name );

    //if (Skin.Instances.hasOwnProperty(name))
    if (  Skin.Instances.get( name )  == undefined  || Skin.Instances.get (name) === undefined 
      ||  Skin.Instances.get (name)   === null      || Skin.Instances.get (name) == null)
    {
        konsole.log ('Détection nouveau skin', LOG_LEVEL.OK) ;

        new_skin = new Skin ( input_item );
        
        //konsole.log ("Avant Insertion : '" + name + "' + Instances.count: " + Skin.Instances.size, LOG_LEVEL.OK) ;
        Skin.Instances.set( name, new_skin );
        konsole.log ("Après Insertion : '" + name + "' + Instances.count: " + Skin.Instances.size, LOG_LEVEL.OK) ;

        //konsole.log("Skin.Instances: " + utility.mapToString(Skin.Instances));
    }
    else 
    {
        konsole.log ('Skin déja créé : ' + name, LOG_LEVEL.OK );
        //new_skin = Skin.Instances[name] ;

        new_skin = Skin.Instances.get( name );

        //konsole.log("Skin.Create new_skin retrouvé: " + JSON.stringify(new_skin));
        //konsole.log("Skin.Instances: count: " +  Skin.Instances.size );
        //konsole.log("Skin.Instances: Skin.Instances: \n" +  utility.mapToString(Skin.Instances), LOG_LEVEL.WARNING ); 
    }

    return new_skin ;
  } // Create()

} // Skin class
//Skin.Instances  = new Array();
Skin.NULL_SKIN ;
exports.Skin = Skin ;
//------------------------ Skin class -------------------------