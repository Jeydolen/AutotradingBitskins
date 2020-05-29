const BitskinsObject  = require ('./bb_obj.js').BitskinsObject;

const LOG_LEVEL   = require ('./bb_log.js').LOG_LEVEL; 
const konsole     = require ('./bb_log.js').konsole ;


/*
  /$$$$$$  /$$       /$$            /$$$$$$              /$$    
 /$$__  $$| $$      |__/           /$$__  $$            | $$    
| $$  \__/| $$   /$$ /$$ /$$$$$$$ | $$  \__/  /$$$$$$  /$$$$$$  
|  $$$$$$ | $$  /$$/| $$| $$__  $$|  $$$$$$  /$$__  $$|_  $$_/  
 \____  $$| $$$$$$/ | $$| $$  \ $$ \____  $$| $$$$$$$$  | $$    
 /$$  \ $$| $$_  $$ | $$| $$  | $$ /$$  \ $$| $$_____/  | $$ /$$
|  $$$$$$/| $$ \  $$| $$| $$  | $$|  $$$$$$/|  $$$$$$$  |  $$$$/
 \______/ |__/  \__/|__/|__/  |__/ \______/  \_______/   \___/  */



class SkinSet extends BitskinsObject
{
    static Instances  = new Map();

    constructor(arg) 
    {
        super (arg);
        this.name = arg ; 
        this.table = 'skin_set';
    } // constructor

  
    static GetNullObject() 
    {
        if (SkinSet.NULL_SKIN_SET == undefined)
            SkinSet.NULL_SKIN_SET = new SkinSet( "NULL_SKIN_SET");
        return SkinSet.NULL_SKIN_SET;
    } // GetNullObject() 


    static GetSkinSet (name)
    {
        var null_skin_set = SkinSet.GetNullObject();
  
        var skin_set = SkinSet.Instances[name];
        if (skin_set != undefined)  return skin_set;
        else                        return null_skin_set;
    } // GetSkinSet()
    

    static GetInstanceCount  ()
    {
        var instance_count = SkinSet.Instances.size ;  // Map !!
        konsole.log("SkinSet.GetInstanceCount:" + instance_count, LOG_LEVEL.CRITICAL);
        return instance_count;
    } // GetInstanceCount()


    static Create (input_item)
    {
        //konsole.log("SkinSet.Create() ", LOG_LEVEL.WARNING);

        var skin_set = SkinSet.GetNullObject();

        if ( SkinSet.Instances === undefined ) 
        {
           // console.log ('Skin set Dictionnaire init') ;
            SkinSet.Instances = {} ;
        }
      
        if (input_item != undefined  &&  input_item['tags'] != undefined  &&  input_item['tags']['itemset']!= undefined)
        {
            var name = input_item['tags']['itemset'];
            if (SkinSet.Instances[name] == undefined )
            {
                skin_set = new SkinSet (name);
                // MxI.$Log.write (skin_set.getName(), ColorConsole.LOG_LEVEL.MSG);
                SkinSet.Instances[name] = skin_set ;
            }
            else
            {
                //konsole.log ('SkinSet déja créé : ' + name, LOG_LEVEL.WARNING);
                skin_set = SkinSet.Instances[name] ;
            }
        }

        return skin_set ;
    }
} // SkinSet class
SkinSet.NULL_SKIN_SET;
exports.SkinSet = SkinSet ;
//----------------------- SkinSet class -----------------------