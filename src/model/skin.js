const assert      = require ('assert');
const expand      = require ('expand-template')();

const LOG_LEVEL       = rekwire ('/src/bb_log.js').LOG_LEVEL; 
const konsole         = rekwire ('/src/bb_log.js').konsole ;


const BitskinsObject  = rekwire ('/src/bb_obj.js').BitskinsObject;
const SQL_TEMPLATE    = rekwire('/src/bb_sql_query.js').SQL_TEMPLATE;
const Weapon          = rekwire ('/src/model/weapon.js').Weapon;
const SkinSet         = rekwire ('/src/model/skin_set.js').SkinSet;


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
  static WeaponToSkin = new Map();

  //   arg =    json_sell_order ou name (pour NULL_SKIN)
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
      this.weapon_id    = 1; // NULL_WEAPON Dans DB
    }
    else
    {  
      // Cas nominal: instance != Skin.NULL_SKIN
      var json_sell_order = arg;
      assert(json_sell_order != undefined);

      this.image_url = json_sell_order.image ;

      this.weapon_name       = Weapon.ExtractName( json_sell_order );
      this.weapon_obj        = Weapon.GetWeapon (this.weapon_name);
      assert ( this.weapon_obj   != Weapon.NULL );
      this.weapon_id        = this.weapon_obj.getRecordId();

      var tags = json_sell_order['tags'];

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
      this.name           = Skin.ExtractName(json_sell_order.market_hash_name); 
      this.item_rarity    = this.computeRarityID(json_sell_order.item_rarity);
      this.table          = 'skin';
    } // if (arg == NULL_SKIN)
  } // constructor()

  //             requis
  getCoVaSeq ( json_sell_order ) 
  { 
    assert ( json_sell_order != undefined );

    var skinset_name      = SkinSet.ExtractName( json_sell_order );
    var skinset_obj       = SkinSet.GetSkinSet (skinset_name);
    assert (skinset_obj != SkinSet.NULL);

    var assignement_value = "`image_url` = '" + this.image_url + "', `has_StatTrak` = " + this.hasStatTrak
                          + ", `skin_rarity` = " + this.item_rarity + ", skin_set = " + skinset_obj.getRecordId() 
                          + ", weapon = " + this.weapon_id ;
    return assignement_value;
  } // getCoVaSeq()


  buildQueryText = () => 
  { 
    var query_text  = expand(SQL_TEMPLATE.SELECT_SKIN.value, { 'db-name-value': this.name, 'db-weapon-id' : this.weapon_id});
    konsole.log ('pet' + query_text);
    return query_text;
  } // buildQueryText()


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
  static Create ( json_sell_order )
  {
    assert(json_sell_order != undefined);

    var skin_obj = Skin.GetNullObject() ;

    var name = Skin.ExtractName( json_sell_order.market_hash_name );
    var from_weapon_skin_obj  = Skin.WeaponToSkin.get( this.weapon_name );
    var from_name_skin_obj    = Skin.Instances.get( name );

    if ( from_weapon_skin_obj != undefined )
    {
        skin_obj = from_weapon_skin_obj;
        skin_obj._is_just_created = false; 
        konsole.log (skin_obj);
    }
    else if ( from_name_skin_obj != undefined )
    {
        skin_obj = from_name_skin_obj;
        skin_obj._is_just_created = false; 
    }
    else
    {
        skin_obj = new Skin ( json_sell_order );
        
        Skin.Instances.set( name, skin_obj );
        Skin.WeaponToSkin.set( skin_obj.weapon_name, skin_obj  );
    }
    return skin_obj ;
  } // Create()

} // Skin class

Skin.NULL_SKIN ;
exports.Skin = Skin ;
//------------------------ Skin class -------------------------