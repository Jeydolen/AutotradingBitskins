const assert                 = require ('assert');

const BitskinsObject         = rekwire ('/src/model/bb_obj.js').BitskinsObject;
const { konsole, LOG_LEVEL } = rekwire ('/src/bb_log.js') ;


const NULL_SKIN_SET             = "NULL_SKIN_SET" ;
const NULL_STICKER_CAPSULE      = "NULL_STICKER_CAPSULE";

 /*$$$$$$  /$$       /$$            /$$$$$$              /$$    
 /$$__  $$| $$      |__/           /$$__  $$            | $$    
| $$  \__/| $$   /$$ /$$ /$$$$$$$ | $$  \__/  /$$$$$$  /$$$$$$  
|  $$$$$$ | $$  /$$/| $$| $$__  $$|  $$$$$$  /$$__  $$|_  $$_/  
 \____  $$| $$$$$$/ | $$| $$  \ $$ \____  $$| $$$$$$$$  | $$    
 /$$  \ $$| $$_  $$ | $$| $$  | $$ /$$  \ $$| $$_____/  | $$ /$$
|  $$$$$$/| $$ \  $$| $$| $$  | $$|  $$$$$$/|  $$$$$$$  |  $$$$/
 \______/ |__/  \__/|__/|__/  |__/ \______/  \_______/   \___*/

class SkinSet extends BitskinsObject
{
    static InstancesByRecordID  = new Map();
    static Instances  = new Map();
    static NULL       = SkinSet.GetNullObject();

    constructor(arg) 
    {
        super (arg);
        if (arg == NULL_SKIN_SET)
            this.name = arg ; 
        else
            this.name = SkinSet.ExtractName(arg);
        this._table = 'skin_set';
    } // constructor

    static ExtractName( input_item )
    {
        assert (input_item != undefined);
        assert (input_item.hasOwnProperty('tags'));
        
        let name = input_item.tags.itemset;
        if (name == undefined)
        {
            name = NULL_SKIN_SET;
            if (input_item.tags.stickercapsule != undefined)
                name = NULL_STICKER_CAPSULE;
        }
            
        assert (name != undefined);
        name = name.replace ("'", "''");
    
        return name;
    }// ExtractName()
  
    static GetNullObject() 
    {
        if (SkinSet.NULL   == undefined)
            SkinSet.NULL   = new SkinSet( NULL_SKIN_SET );
        return SkinSet.NULL;
    } // GetNullObject() 


    static GetSkinSet (name)
    {
        let null_skin_set = SkinSet.GetNullObject();
  
        let skin_set = SkinSet.Instances.get (name);
        if (skin_set != undefined)  return skin_set;
        else                        return null_skin_set;
    } // GetSkinSet()
    

    static GetInstanceCount  ()
    {
        let instance_count = SkinSet.Instances.size ;  // Map !!
        konsole.log("SkinSet.GetInstanceCount:" + instance_count, LOG_LEVEL.CRITICAL);
        return instance_count;
    } // GetInstanceCount()


    static Create (input_item)
    {
        assert (input_item != undefined);

        let skin_set = SkinSet.GetNullObject();

        let name = SkinSet.ExtractName(input_item);

        if (SkinSet.Instances.get (name) == undefined )
        {
            skin_set = new SkinSet (input_item);
            SkinSet.Instances.set ( name,skin_set );
        }
        else
        {
            skin_set = SkinSet.Instances.get (name) ;
            skin_set._is_just_created = false; 
        }

        return skin_set ;
    }// Create()
    
} // SkinSet class

exports.SkinSet = SkinSet ;
//----------------------- SkinSet class -----------------------