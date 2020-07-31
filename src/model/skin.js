const assert      = require ('assert');

const Session                = rekwire ('/src/session.js').Session;
const { konsole, LOG_LEVEL } = rekwire ('/src/bb_log.js') ;
const BitskinsObject  = rekwire ('/src/model/bb_obj.js').BitskinsObject;
const Konst           = rekwire ('/src/constants.js');
const Weapon          = rekwire ('/src/model/weapon.js').Weapon;
const SkinSet         = rekwire ('/src/model/skin_set.js').SkinSet;


const NULL_SKIN   = "NULL_SKIN" ;
const NULL_URL    = "http://NULL_URL";
const NULL_RARITY = "Unknown"; // Meme valeur que dans la Table de constantes 'skin_rarity'



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
  static InstancesByRecordID  = new Map();

  //   arg =    json_sell_order ou name (pour NULL_SKIN)
  constructor( arg ) 
  {
    super (arg)    ;  
    this._table              = 'skin';
    //                      Flag       WP_name |  Skin name  (State(float_value))
    // "market_hash_name": "StatTrak™    M4A4  |  X-Ray      (Minimal Wear)",
    //console.log("Skin constructor : " + arg);

    if ( arg == NULL_SKIN )
    {
      // Cas particulier: instanciation du NullObject (cf. Design Patterns)
      this.name         = NULL_SKIN ;
      this.image_url    = NULL_URL ;
      this.item_rarity  = NULL_RARITY ;
      this.weapon_id    = 1; // NULL_WEAPON Dans DB
      this.short_name   = NULL_SKIN;
    }
    else
    {  
      // Cas nominal: instance != Skin.NULL_SKIN

      assert (arg != undefined);

      var json_sell_order     = arg;
      this.name               = Skin.ExtractName(json_sell_order); 
      this.short_name         = Skin.ExtractShortName ( json_sell_order );
      this.image_url          = json_sell_order.image ;
      this.weapon_name        = Weapon.ExtractName( json_sell_order );
      this.weapon_obj         = Weapon.GetWeapon (this.weapon_name);
      this.weapon_id          = this.weapon_obj.getRecordId();
      this.item_rarity        = this.computeRarityID(json_sell_order.item_rarity);
      assert ( this.weapon_obj   != Weapon.NULL );
    } // if (arg == NULL_SKIN)
  } // constructor()

  //             requis
  getCoVaSeq ( json_sell_order ) 
  { 
    assert ( json_sell_order != undefined );

    var skinset_name      = SkinSet.ExtractName( json_sell_order );
    var skinset_obj       = SkinSet.GetSkinSet (skinset_name);
    assert (skinset_obj != SkinSet.NULL);

    var assignement_value = "`image_url` = '" + this.image_url + "', `skin_rarity` = " + this.item_rarity 
                          + ", skin_set = " + skinset_obj.getRecordId() 
                          + ", weapon = " + this.weapon_id  + ", `short_name` = '" + this.short_name + "'" ;
                        
    if ( Session.GetSingleton().getAppVar (Session.IsProd) == false)  
      assignement_value += ", `has_StatTrak` = " + this.hasStatTrak;
    return assignement_value;
  } // getCoVaSeq()


  static ExtractName( json_sell_order )
  {
    var name = Konst.NOTHING;
   
    var skin_name = Skin.ExtractShortName (json_sell_order);
    var weapon_name = Weapon.ExtractName  (json_sell_order);
    name = weapon_name + ' | ' + skin_name;

    return name;
  } // ExtractName()


  static ExtractShortName ( json_sell_order )
  {
    assert (json_sell_order != undefined)
    var skin_name = json_sell_order.market_hash_name;
    assert ( skin_name != undefined, "Ce n'est pas le json_sell_order");

    //                     ------ left ------   ---------- right ----------
    // "market_hash_name": "StatTrak™    M4A4  |  X-Ray      (Minimal Wear)",
    if ( skin_name.search('|') != -1)
    {
      var parts = skin_name.split('|');

      if (parts.length > 1)
      {
        var right_part =  skin_name.split('|')[1];
        right_part = right_part.trim();
        skin_name = right_part.split('(')[0].trim(' ');

        // !!! Probléme: ' dans la valeur SQL de chaine ex: 'l'Horizon' -> 'l''Horizon'
        // !!! Solution: escape de ' rempacé par ''
        skin_name = skin_name.replace ("'", "\\'");
      } 
    }
    return skin_name;
  } // ExtractShortName ()


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

    var name                  = Skin.ExtractName( json_sell_order);

    if ( Skin.Instances.has( name ) ) 
    {
        skin_obj = Skin.Instances.get(name);
        skin_obj._is_just_created = false; 
      //  konsole.log (JSON.stringify(skin_obj), LOG_LEVEL.CRITICAL);
    }
    else
    {
        skin_obj = new Skin ( json_sell_order );
        Skin.Instances.set( name, skin_obj  );
    }
    return skin_obj ;
  } // Create()

} // Skin class

Skin.NULL_SKIN ;
exports.Skin = Skin ;
//------------------------ Skin class -------------------------