const assert      = require ('assert');

const Konst       = require ('./constants.js') ;
const LOG_LEVEL   = require ('./bb_log.js').LOG_LEVEL; 
const konsole     = require ('./bb_log.js').konsole ;
const BB_SqlQuery = require ('./bb_sql_query.js').BB_SqlQuery ;


/*
  /$$$$$$  /$$       /$$            /$$$$$$              /$$    
 /$$__  $$| $$      |__/           /$$__  $$            | $$    
| $$  \__/| $$   /$$ /$$ /$$$$$$$ | $$  \__/  /$$$$$$  /$$$$$$  
|  $$$$$$ | $$  /$$/| $$| $$__  $$|  $$$$$$  /$$__  $$|_  $$_/  
 \____  $$| $$$$$$/ | $$| $$  \ $$ \____  $$| $$$$$$$$  | $$    
 /$$  \ $$| $$_  $$ | $$| $$  | $$ /$$  \ $$| $$_____/  | $$ /$$
|  $$$$$$/| $$ \  $$| $$| $$  | $$|  $$$$$$/|  $$$$$$$  |  $$$$/
 \______/ |__/  \__/|__/|__/  |__/ \______/  \_______/   \___/  */



class SkinSet
{
    constructor(name) 
    {
        this.name = name ; 
        this.stored = false;
    } // constructor

    //         requis
    storeInDB (db_obj)
    {
        assert( db_obj != undefined );

        if (this.name == undefined)
        {
            konsole.log('Skinset storeinDB() Sql error name : ' + this.name, LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        } 

        if (this.stored) return Konst.RC.KO;

        // konsole.log("SkinSet.storeinDB() name: " + this.name, ColorConsole.LOG_LEVEL.OK);


        // INSERT INTO `skin` (name) SELECT 'Forest' FROM DUAL WHERE NOT EXISTS (SELECT name FROM skin WHERE name='Forest');
        var conditional_insert_query = "INSERT INTO `skin_set` (`name`) SELECT '"+ this.name + "' FROM DUAL "
        +  "WHERE NOT EXISTS (SELECT `name` FROM `skin_set` WHERE `name`= '"+ this.name + "');";

        var query_obj = BB_SqlQuery.Create();
        query_obj.execute(db_obj, conditional_insert_query )
        .then( rows => 
        {
            //konsole.log(query_obj.getCommand() + " successful in 'skin_set' ", LOG_LEVEL.INFO);
        } );


      this.stored = true;
    } // storeInDB()

    static GetNullObject() 
    {
        if (SkinSet.NULL_SKIN_SET == undefined)
            SkinSet.NULL_SKIN_SET = new SkinSet( "NULL_SKIN_SET");
        return SkinSet.NULL_SKIN_SET;
    } // GetNullObject() 

    getName () 
    {
        return this.name ;
    }

    isStored () 
    {
        return this.stored ;
    }

    static GetSkinSet (name)
    {
        var null_skin_set = SkinSet.GetNullObject();
  
        var skin_set = SkinSet.Instances[name];
        if (skin_set != undefined)  return skin_set;
        else                        return null_skin_set;
    } // GetSkinSet()
    
    static GetInstances ()
    {
        return SkinSet.Instances;
    }


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
SkinSet.Instances ;
SkinSet.NULL_SKIN_SET;
exports.SkinSet = SkinSet ;
//----------------------- SkinSet class -----------------------