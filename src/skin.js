const assert      = require ('assert');

const LOG_LEVEL   = require ('./bb_log.js').LOG_LEVEL; 
const konsole     = require ('./bb_log.js').konsole ;


const BitskinsObject  = require ('./bb_obj.js').BitskinsObject;
const Weapon          = require ('./weapon.js').Weapon;
const SkinSet         = require ('./skin_set.js').SkinSet;


const NULL_SKIN   = "NULL_SKIN" ;
const NULL_URL    = "http://NULL_URL";
const NULL_RARITY = "Unknown"; // M^mem valeur que dans la Table de constantes 'skin_rarity'



                        /*$$$$$$  /$$       /$$          
                        /$$__  $$| $$      |__/          
                        |$$  \__/| $$   /$$ /$$ /$$$$$$$ 
                        | $$$$$$ | $$  /$$/| $$| $$__  $$
                        \____  $$| $$$$$$/ | $$| $$  \ $$
                        /$$  \ $$| $$_  $$ | $$| $$  | $$
                        | $$$$$$/| $$ \  $$| $$| $$  | $$
                        \______/ |__/  \__/|__/|__/  |_*/

class Skin extends BitskinsObject
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

  //             requis
  getCoVaSeq ( json_sell_order ) 
  { 
    assert ( json_sell_order != undefined );

    var weapon_name       = Weapon.ExtractName( json_sell_order );
    var weapon_obj        = Weapon.GetWeapon (weapon_name);
    assert ( weapon_obj != Weapon.NULL );

    var skinset_name      = SkinSet.ExtractName( json_sell_order );
    var skinset_obj       = SkinSet.GetSkinSet (skinset_name);
    assert (skinset_obj != SkinSet.NULL);

    var assignement_value = "`image_url` = '" + this.image_url + "', `has_StatTrak` = " + this.hasStatTrak
                          + ", `skin_rarity` = " + this.item_rarity + ", skin_set = " + skinset_obj.getRecordId() 
                          + ", weapon = " + weapon_obj.getRecordId() ;
    return assignement_value;
  } // getCoVaSeq()


  static ExtractName( market_hash_name )
  {
    var name = market_hash_name;
    if ( market_hash_name.search('|') != -1)
    {

      var parts = market_hash_name.split('|');

      if (parts.length > 1)
      {
        var right_part =  market_hash_name.split('|')[1];
        right_part = right_part.trim();
        name = right_part.split('(')[0].trim(' ');

        // !!! Probléme: ' dans la valeur SQL de chaine ex: 'l'Horizon' -> 'l''Horizon'
        // !!! Solution: escape de ' rempacé par ''
        name = name.replace ("'", "\\'");
      } 

    }
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
    assert(input_item != undefined);

    var skin_obj = Skin.GetNullObject() ;

    var name = Skin.ExtractName( input_item.market_hash_name );

    if (  Skin.Instances.get( name )  == undefined  || Skin.Instances.get (name) === undefined 
      ||  Skin.Instances.get (name)   === null      || Skin.Instances.get (name) == null)
    {
        //konsole.log ('Détection nouveau skin', LOG_LEVEL.OK) ;

        skin_obj = new Skin ( input_item );
        
        Skin.Instances.set( name, skin_obj );
        //konsole.log ("Après Insertion : '" + name + "' + Instances.count: " + Skin.Instances.size, LOG_LEVEL.OK) ;
    }
    else 
    {
        //konsole.log ('Skin déja créé : ' + name, LOG_LEVEL.OK );

        skin_obj = Skin.Instances.get( name );
        skin_obj._is_just_created = false; 
    }

    return skin_obj ;
  } // Create()

} // Skin class

Skin.NULL_SKIN ;
exports.Skin = Skin ;
//------------------------ Skin class -------------------------