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
            MxI.$Log.write('Skinset storeinDB() Sql error name : ' + this.name, LOG_LEVEL.ERROR);
            return Konst.RC.KO;
        } 

        if (this.stored) return Konst.RC.KO;

        // MxI.$Log.write("SkinSet.storeinDB() name: " + this.name, ColorConsole.LOG_LEVEL.OK);

        var insert_query = "INSERT INTO `skin_set` (`name`) "
                         + "VALUES ( '" +  this.name + "'  );";
               
        var query_obj = BB_SqlQuery.Create();
        query_obj.execute(db_obj, insert_query )
        .then( rows => 
        {
            konsole.log(query_obj.getCommand() + " successful", LOG_LEVEL.INFO);
        } );


      this.stored = true;
    } // storeInDB()

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
      if (SkinSet.NULL_SKINSET == undefined)
          SkinSet.NULL_SKINSET = new SkinSet (null, "NULL");
  
      var skin_set = SkinSet.Instances[name];
      if (skin_set != undefined)
        return skin_set;
      else
        return SkinSet.NULL_SKINSET;
    } // GetSkinSet()
    
    static GetInstances ()
    {
        return SkinSet.Instances;
    }


    static Create (input_item)
    {
        konsole.log("SkinSet.Create() ", LOG_LEVEL.WARNING);

        if (SkinSet.NULL_SKINSET == undefined)
            SkinSet.NULL_SKINSET = new SkinSet (null, "NOTHING");

        if ( db_obj == undefined )
        {
            konsole.log("SkinSet.Create() db_obj undefined !!");
            return SkinSet.NULL_SKINSET;
        }

        var skin_set = SkinSet.NULL_SKINSET ;

        if ( SkinSet.Instances === undefined ) 
        {
           // console.log ('Skin set Dictionnaire init') ;
            SkinSet.Instances = {} ;
        }
      
        var name = input_item['tags']['itemset'] ;

        if (name == undefined)
            skin_set =  SkinSet.NULL_SKINSET;
        
        else 
        {
            if (SkinSet.Instances[name] == undefined )
            {
                // console.log ('Détection nouveau skin set') ;
                skin_set = new SkinSet (name);
                // MxI.$Log.write (skin_set.getName(), ColorConsole.LOG_LEVEL.MSG);
                SkinSet.Instances[name] = skin_set ;
            }
            else
            {
                MxI.$Log.write ('Skin Set déja créé : ' + name, LOG_LEVEL.ERROR);
                skin_set = SkinSet.Instances[name] ;
            }
        }

        return skin_set ;
    }
} // SkinSet class
SkinSet.Instances ;
SkinSet.NULL_SKINSET;
exports.SkinSet = SkinSet ;
//----------------------- SkinSet class -----------------------