const assert            = require ('assert');


const BitskinsObject    = require ('./bb_obj.js').BitskinsObject;

const LOG_LEVEL         = require ('./bb_log.js').LOG_LEVEL; 
const konsole           = require ('./bb_log.js').konsole ;

const NULL_STICKER = "NULL_STICKER";


class Sticker extends BitskinsObject
{
    static Instances    = new Map();
    static NULL         = Sticker.GetNullObject();


    constructor(arg) 
    {
        super (arg);
    
        if ( arg == NULL_STICKER )
            this.name = NULL_STICKER ;
        else 
            this.name = Sticker.ExtractName(arg) ; 

        this.item_type = arg.item_type;
        this.table = 'sticker';

    } // constructor




    static ExtractName( input_item )
    {
        assert (input_item != undefined);
        var name        = NULL_STICKER;
        var item_type   = Sticker.ExtractType( input_item );

        if ( item_type == STICKER_TYPE )
        {
            if ( input_item.market_hash_name.search('|') != -1)
            {
                var parts = input_item.market_hash_name.split('|');
                if (parts.length >= 2)
                {
                    name = parts[1];
                    if (parts.length == 3)   name += parts[2];                    
                    name = name.replace ("'", "''");
                }
            }
        }
        else
            konsole.error ("KEKETUFOU LA (sticker.js) item_type: " + item_type);
        return item_type;
    } // ExtractName()
    
  
    static GetNullObject() 
    {
        if (Sticker.NULL == undefined)
            Sticker.NULL = new Sticker(NULL_STICKER);
        return Sticker.NULL;
    } // GetNullObject() 


    static GetSticker (name)
    {
        Sticker.GetNullObject();
  
        var sticker = Sticker.Instances.get (name);
        if (sticker != undefined)   return sticker;
        else                        return Sticker.NULL;
    } // GetWeapon()
    
    

    static GetInstanceCount  ()
    {
        var instance_count = Sticker.Instances.size ;  // Map !!
        konsole.log("Sticker.GetInstanceCount:" + instance_count, LOG_LEVEL.OK);
        return instance_count;
    } // GetInstanceCount()


    static Create ( input_item )
    {
        assert(input_item != undefined);

        var item_type = Sticker.ExtractType( input_item );
        assert(item_type == STICKER_TYPE);
        
        var name = Sticker.ExtractName( input_item);
        var sticker_obj = Sticker.GetNullObject() ; 


        if ( Sticker.Instances.get( name )  == undefined  || Sticker.Instances.get (name) === undefined )
        {
            konsole.log ("name : " + JSON.stringify(name)) ;
            konsole.log ('Détection nouveau Sticker', LOG_LEVEL.OK) ;

            sticker_obj = new Sticker ( input_item );
            
            //konsole.log ("Avant Insertion : '" + name + "' + Instances.count: " + Sticker.Instances.size, LOG_LEVEL.OK) ;
            Sticker.Instances.set( name, sticker_obj );
            konsole.log ("Après Insertion : '" + name + "' + Instances.count: " + Sticker.Instances.size, LOG_LEVEL.OK) ;

            //konsole.log("Sticker.Instances: " + utility.mapToString(Sticker.Instances));
        }
        else 
        {
            //konsole.log ('Sticker déja créé : ' + name, LOG_LEVEL.WARNING );
            sticker_obj = Sticker.Instances.get( name );
            sticker_obj._is_just_created = false; 
        }

        return sticker_obj ;
    } // Create()

} // Sticker class
exports.Sticker = Sticker ;
//----------------------- Sticker class -----------------------