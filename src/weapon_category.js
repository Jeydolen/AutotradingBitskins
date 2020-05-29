const assert      = require ('assert');

const BitskinsObject  = require ('./bb_obj.js').BitskinsObject;

const LOG_LEVEL   = require ('./bb_log.js').LOG_LEVEL; 
const konsole     = require ('./bb_log.js').konsole ;


const NULL_WEAPON_CATEGORY  = "NULL_WEAPON_CATEGORY" ;
const NULL_CASE             = "NULL_CASE";

/*
/$$      /$$                                                    /$$$$$$              /$$                                                      
| $$  /$ | $$                                                   /$$__  $$            | $$                                                      
| $$ /$$$| $$  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$$ | $$  \__/  /$$$$$$  /$$$$$$    /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$  /$$   /$$
| $$/$$ $$ $$ /$$__  $$ |____  $$ /$$__  $$ /$$__  $$| $$__  $$| $$       |____  $$|_  $$_/   /$$__  $$ /$$__  $$ /$$__  $$ /$$__  $$| $$  | $$
| $$$$_  $$$$| $$$$$$$$  /$$$$$$$| $$  \ $$| $$  \ $$| $$  \ $$| $$        /$$$$$$$  | $$    | $$$$$$$$| $$  \ $$| $$  \ $$| $$  \__/| $$  | $$
| $$$/ \  $$$| $$_____/ /$$__  $$| $$  | $$| $$  | $$| $$  | $$| $$    $$ /$$__  $$  | $$ /$$| $$_____/| $$  | $$| $$  | $$| $$      | $$  | $$
| $$/   \  $$|  $$$$$$$|  $$$$$$$| $$$$$$$/|  $$$$$$/| $$  | $$|  $$$$$$/|  $$$$$$$  |  $$$$/|  $$$$$$$|  $$$$$$$|  $$$$$$/| $$      |  $$$$$$$
|__/     \__/ \_______/ \_______/| $$____/  \______/ |__/  |__/ \______/  \_______/   \___/   \_______/ \____  $$ \______/ |__/       \____  $$
                                 | $$                                                                   /$$  \ $$                     /$$  | $$
                                 | $$                                                                  |  $$$$$$/                    |  $$$$$$/
                                 |__/                                                                   \______/                      \______/ */



class WeaponCategory extends BitskinsObject
{
    static Instances    = new Map();
    static NULL         = WeaponCategory.GetNullObject();


    constructor(arg) 
    {
        super (arg);
    
        if ( arg == NULL_WEAPON_CATEGORY )
            this.name = NULL_WEAPON_CATEGORY ;
        else 
            this.name = WeaponCategory.ExtractName(arg) ; 

        this.table = 'weapon_category';
    } // constructor

    static ExtractName( input_item )
    {
        //konsole.log("Skin.ExtractName market_hash_name: '" + market_hash_name + "'", LOG_LEVEL.MSG)
        var name = input_item.item_weapon;

        if (name == undefined)
            name = NULL_WEAPON_CATEGORY;
        else    
            name = name.replace ("'", "''");
    
        return name;// ExtractName()
    }

  
    static GetNullObject() 
    {
        if (WeaponCategory.NULL == undefined)
            WeaponCategory.NULL = new WeaponCategory(NULL_WEAPON_CATEGORY);
        return WeaponCategory.NULL;
    } // GetNullObject() 


    static GetWeaponCategory (name)
    {
        var null_weapon_category = WeaponCategory.GetNullObject();
  
        var weapon_category = WeaponCategory.Instances.get (name);
        if (weapon_category != undefined)   return weapon_category;
        else                                return null_weapon_category;
    } // GetWeaponCategory()
    
    

    static GetInstanceCount  ()
    {
        var instance_count = WeaponCategory.Instances.size ;  // Map !!
        konsole.log("WeaponCategory.GetInstanceCount:" + instance_count, LOG_LEVEL.CRITICAL);
        return instance_count;
    } // GetInstanceCount()


    static Create ( input_item )
    {
        assert(input_item != undefined);

        var item_weapon = input_item.item_weapon;

        if (item_weapon == undefined || item_weapon == null )
            item_weapon = NULL_WEAPON_CATEGORY;

        if (item_weapon == 'null')
                konsole.log ("PAS COOL !!", LOG_LEVEL.CRITICAL);

        konsole.log ("WeaponCategory.Create()\n", LOG_LEVEL.ERROR);
        konsole.log (item_weapon, LOG_LEVEL.MSG);

        var name = item_weapon.replace ("'", "''");;

        var weapon_category = WeaponCategory.GetNullObject() ; 

        //if (WeaponCategory.Instances.hasOwnProperty(name))
        if ( WeaponCategory.Instances.get( name )  == undefined  || WeaponCategory.Instances.get (name) === undefined )
        {
            konsole.log ('Détection nouveau WeaponCategory', LOG_LEVEL.OK) ;

            weapon_category = new WeaponCategory ( input_item );
            
            //konsole.log ("Avant Insertion : '" + name + "' + Instances.count: " + WeaponCategory.Instances.size, LOG_LEVEL.OK) ;
            WeaponCategory.Instances.set( name, weapon_category );
            konsole.log ("Après Insertion : '" + name + "' + Instances.count: " + WeaponCategory.Instances.size, LOG_LEVEL.OK) ;

            //konsole.log("WeaponCategory.Instances: " + utility.mapToString(WeaponCategory.Instances));
        }
        else 
        {
            konsole.log ('WeaponCategory déja créé : ' + name, LOG_LEVEL.OK );
            //new_weapon_category = Skin.Instances[name] ;

            weapon_category = WeaponCategory.Instances.get( name );
        }

        return weapon_category ;
    } // Create()

} // WeaponCategory class

exports.WeaponCategory = WeaponCategory ;
//----------------------- WeaponCategory class -----------------------