const assert            = require ('assert');
const Enum              = require('enum');


const BitskinsObject    = require ('./bb_obj.js').BitskinsObject;

const LOG_LEVEL         = require ('./bb_log.js').LOG_LEVEL; 
const konsole           = require ('./bb_log.js').konsole ;

const NULL_WEAPON  = "NULL_WEAPON" ;
const NULL_CASE    = "NULL_CASE";

const WEAPON_TYPE_DB_IDS = new Enum  ({ 'Unknown' : 0, 'Knife' : 1, 'Pistol' : 2,
                                        'SMG' : 3, 'Rifle' : 4, 'Sniper Rifle' : 5, 'Shotgun': 6, 'Machinegun' : 7 });

/*
/$$      /$$                                                                              
| $$  /$ | $$                                                                                      
| $$ /$$$| $$  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$$ 
| $$/$$ $$ $$ /$$__  $$ |____  $$ /$$__  $$ /$$__  $$| $$__  $$|
| $$$$_  $$$$| $$$$$$$$  /$$$$$$$| $$  \ $$| $$  \ $$| $$  \ $$|
| $$$/ \  $$$| $$_____/ /$$__  $$| $$  | $$| $$  | $$| $$  | $$|
| $$/   \  $$|  $$$$$$$|  $$$$$$$| $$$$$$$/|  $$$$$$/| $$  | $$|
|__/     \__/ \_______/ \_______/| $$____/  \______/ |__/  |__/ 
                                 | $$                                                                 
                                 | $$                                                                  
                                 |_*/

class Weapon extends BitskinsObject
{
    static Instances    = new Map();
    static NULL         = Weapon.GetNullObject();


    constructor(arg) 
    {
        super (arg);
    
        if ( arg == NULL_WEAPON )
            this.name = NULL_WEAPON ;
        else 
            this.name = Weapon.ExtractName(arg) ; 

        this.item_type = arg.item_type;
        this.table = 'weapon';

    } // constructor


    static ExtractName( input_item )
    {
        assert (input_item != undefined);
        assert (input_item.hasOwnProperty('item_weapon'));
        //konsole.log ('coucou :' + typeof (input_item.item_weapon), LOG_LEVEL.STEP);
        var name = input_item.item_weapon;

        if (name == undefined || name == 'null' ||name == null)
            name = NULL_CASE;
        else    
            name = name.replace ("'", "''");   
        return name;
    } // ExtractName()

    
    static ComputeWeaponTypeId ( item_type )
    {
        return  ( item_type == 'Machinegun')        ? WEAPON_TYPE_DB_IDS['Machinegun'].value:
                ( item_type == 'Shotgun')           ? WEAPON_TYPE_DB_IDS['Shotgun'].value :
                ( item_type == 'Sniper Rifle')      ? WEAPON_TYPE_DB_IDS['Sniper Rifle'].value : 
                ( item_type == 'Rifle')             ? WEAPON_TYPE_DB_IDS['Rifle'].value : 
                ( item_type == 'SMG')               ? WEAPON_TYPE_DB_IDS['SMG'].value :
                ( item_type == 'Pistol')            ? WEAPON_TYPE_DB_IDS['Pistol'].value :
                ( item_type == 'Knife')             ? WEAPON_TYPE_DB_IDS['Knife'].value :
                                                      WEAPON_TYPE_DB_IDS['Unknown'].value ;
    } // ComputeWeaponTypeId()

    
    //            optionnel
    getCoVaSeq( json_sell_order )
    { 
        var assignement_value = "type = " + Weapon.ComputeWeaponTypeId(this.item_type);
        return assignement_value;
    }

  
    static GetNullObject() 
    {
        if (Weapon.NULL == undefined)
            Weapon.NULL = new Weapon(NULL_WEAPON);
        return Weapon.NULL;
    } // GetNullObject() 


    static GetWeapon (name)
    {
        Weapon.GetNullObject();
  
        var weapon = Weapon.Instances.get (name);
        if (weapon != undefined)   return weapon;
        else                                return Weapon.NULL;
    } // GetWeapon()
    
    

    static GetInstanceCount  ()
    {
        var instance_count = Weapon.Instances.size ;  // Map !!
        konsole.log("Weapon.GetInstanceCount:" + instance_count, LOG_LEVEL.OK);
        return instance_count;
    } // GetInstanceCount()


    static Create ( input_item )
    {
        assert(input_item != undefined);

        var item_weapon = input_item.item_weapon;

        if (item_weapon == undefined || item_weapon == null )
            item_weapon = NULL_WEAPON;

        if (item_weapon == 'null')
                konsole.log ("PAS COOL !!", LOG_LEVEL.OK);
        
        var name = Weapon.ExtractName( input_item);
        //konsole.log ("Weapon.Create( " + name + " )", LOG_LEVEL.OK);
        //konsole.log ("item_weapon : " + item_weapon, LOG_LEVEL.MSG);
   

        var weapon = Weapon.GetNullObject() ; 

        //if (Weapon.Instances.hasOwnProperty(name))
        //konsole.log ("Weapon.Instances.get( name ): " + JSON.stringify(name), LOG_LEVEL.OK) ;

        if ( Weapon.Instances.get( name )  == undefined  || Weapon.Instances.get (name) === undefined )
        {
            konsole.log ("name : " + JSON.stringify(name)) ;
            konsole.log ('Détection nouveau Weapon', LOG_LEVEL.OK) ;

            weapon = new Weapon ( input_item );
            
            //konsole.log ("Avant Insertion : '" + name + "' + Instances.count: " + Weapon.Instances.size, LOG_LEVEL.OK) ;
            Weapon.Instances.set( name, weapon );
            konsole.log ("Après Insertion : '" + name + "' + Instances.count: " + Weapon.Instances.size, LOG_LEVEL.OK) ;

            //konsole.log("Weapon.Instances: " + utility.mapToString(Weapon.Instances));
        }
        else 
        {
            //konsole.log ('Weapon déja créé : ' + name, LOG_LEVEL.WARNING );
            weapon = Weapon.Instances.get( name );
            weapon._is_just_created = false; 
        }

        return weapon ;
    } // Create()

} // Weapon class

exports.Weapon = Weapon ;
//----------------------- Weapon class -----------------------