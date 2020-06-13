const assert            = require ('assert');
const Enum              = require('enum');

const BitskinsObject    = rekwire ('/src/bb_obj.js').BitskinsObject;
const Konst             = rekwire ('/src/constants.js');

const Weapon            = rekwire ('/src/model/weapon.js').Weapon;
const Skin              = rekwire ('/src/model/skin.js').Skin; 


const LOG_LEVEL         = rekwire ('/src/bb_log.js').LOG_LEVEL; 
const konsole           = rekwire ('/src/bb_log.js').konsole ;

const NULL_DUMB                 = "NULL_DUMB" ;
const STICKER_TYPE              = "Sticker";
const SKIN_TYPE                 = "Skin";
const AGENT_TYPE                = "Agent";
const CONTAINER_TYPE            = "Container";
const NULL_ITEM_TYPE            = "NULL_ITEM_TYPE";


//============================================ https://www.npmjs.com/package/enum =====================================================
const ITEM_TYPE_TABLE_IDS = new Enum  ({  'NULL_ITEM_TYPE' : 0, 'Skin' : 1, 'Agent' : 2,
                                          'Sticker' : 3, 'Container' : 4, 'AFER' : 5 });

class DumbItem extends BitskinsObject
{
    static Instances    = new Map();
    static NULL         = DumbItem.GetNullObject();

    //           name | json_sell_order
    constructor(     arg              ) 
    {
        super( arg );
    
        if ( arg == NULL_DUMB )
        {
            this.name = NULL_DUMB ;
            this.item_type  = NULL_ITEM_TYPE;
        }

        else 
        {
            var json_sell_order = arg;
            this.name       = DumbItem.ExtractName( json_sell_order ) ; 
            this.item_type  = json_sell_order.item_type;
        } 

        this.table      = 'dumb_item';
    } // constructor


    static ComputeItemTypeID ( item_type ) 
    {   
        //konsole.log("item_type: '" + item_type + "'", LOG_LEVEL.OK);
        var weapon_type_id = Weapon.ComputeWeaponTypeId( item_type) ;
        //konsole.log (ITEM_TYPE_TABLE_IDS[CONTAINER_TYPE], LOG_LEVEL.OK);

        if (weapon_type_id != 0 )
        {
            //konsole.log('weapon_type_id: ' + weapon_type_id );
            return  ITEM_TYPE_TABLE_IDS[SKIN_TYPE].value;
        }    

        return  ( item_type == AGENT_TYPE    ) ? ITEM_TYPE_TABLE_IDS[AGENT_TYPE].value     :
                ( item_type == STICKER_TYPE  ) ? ITEM_TYPE_TABLE_IDS[STICKER_TYPE].value   : 
                ( item_type == CONTAINER_TYPE) ? ITEM_TYPE_TABLE_IDS[CONTAINER_TYPE].value : ITEM_TYPE_TABLE_IDS['AFER'].value ;// 5 = AFER dans la table item_type
    } // computeStateID()


    //====================================================================================================
    // Utilisée dans 'DBPopulater' par 'populateDBWithSkinOrDumb_CB'
    static ExtractType( json_sell_order )
    {
        assert (json_sell_order != undefined);
        assert (json_sell_order.hasOwnProperty('item_type'));

        var item_type = json_sell_order.item_type;

        // Item is either a 'Skin' or a 'DumbItem'
        var item_type_id = DumbItem.ComputeItemTypeID( item_type)


        if ( item_type_id == ITEM_TYPE_TABLE_IDS[SKIN_TYPE].value )
            return Skin; 
        else 
            return DumbItem;
    } // ExtractType()
    //====================================================================================================

    static ExtractName( json_sell_order )
    {
        assert (json_sell_order != undefined);
        assert (json_sell_order.hasOwnProperty('item_type'));
        var name = json_sell_order.market_hash_name;
        name = name.replace("'", "\\'")
        return name;
    } // ExtractName()

    
    static GetNullObject() 
    {
        if (DumbItem.NULL == undefined)
            DumbItem.NULL = new DumbItem(NULL_DUMB);
        return DumbItem.NULL;
    } // GetNullObject() 


    static GetDumbItem (name)
    {
        DumbItem.GetNullObject();
  
        var dumb_item_obj = DumbItem.Instances.get (name);
        if (dumb_item_obj != undefined)   return dumb_item_obj;
        else                       return DumbItem.NULL;
    } // GetWeapon()
    
    

    static GetInstanceCount  ()
    {
        var instance_count = DumbItem.Instances.size ;  // Map !!
        //konsole.log("DumbItem.GetInstanceCount:" + instance_count, LOG_LEVEL.OK);
        return instance_count;
    } // GetInstanceCount()


    //            optionnel
    /*
    getCoVaSeq( json_sell_order )
    { 
        var assignement_value = "item_type = " + DumbItem.ComputeItemTypeID(this.item_type);
        return assignement_value;
    }
    */

    static Create ( json_sell_order )
    {
        assert(json_sell_order != undefined);

        var item_type = json_sell_order.item_type;

        if (item_type == undefined || item_type == null )
        item_type = NULL_DUMB;

        if (item_type == 'null')
            konsole.log ("PAS COOL !!", LOG_LEVEL.OK);
        
        var name = DumbItem.ExtractName( json_sell_order);

        var dumb_item_obj = DumbItem.GetNullObject() ; 

        if ( DumbItem.Instances.get( name )  == undefined  || DumbItem.Instances.get (name) === undefined )
        {
            //konsole.log ("name : " + JSON.stringify(name)) ;
            //konsole.log ('Détection nouveau DumbItem', LOG_LEVEL.OK) ;

            dumb_item_obj = new DumbItem ( json_sell_order );
           
            DumbItem.Instances.set( name, dumb_item_obj );
            //konsole.log ("Après Insertion : '" + name + "' + Instances.count: " + DumbItem.Instances.size, LOG_LEVEL.OK) ;
        }
        else 
        {
            dumb_item_obj = DumbItem.Instances.get( name );
            dumb_item_obj._is_just_created = false; 
        }

        return dumb_item_obj ;
    } // Create()

} // DumbItem class

exports.DumbItem = DumbItem ;
//----------------------- DumbItem class -----------------------