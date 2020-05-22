const assert      = require ('assert');
const timestamp   = require ('time-stamp');
const expand      = require ('expand-template')();
const asynk       = require ('async');

const Konst       = require ('./constants.js') ;
const LOG_LEVEL   = require ('./bb_log.js').LOG_LEVEL; 
const konsole     = require ('./bb_log.js').konsole ;
const BB_SqlQuery = require ('./bb_sql_query.js').BB_SqlQuery ;
const SQL_TEMPLATE = require('./bb_sql_query.js').SQL_TEMPLATE;
const utility     = require ('./utility.js') ;


const NULL_SKIN   = "NULL_SKIN" ;
const NULL_URL    = "http://NULL_URL";
const NULL_RARITY = "Unknown"; // M^mem valeur que dans la Table de constantes 'skin_rarity'



                            //    /$$$$$$  /$$       /$$          
                            //   /$$__  $$| $$      |__/          
                            //  | $$  \__/| $$   /$$ /$$ /$$$$$$$ 
                            //  |  $$$$$$ | $$  /$$/| $$| $$__  $$
                            //   \____  $$| $$$$$$/ | $$| $$  \ $$
                            //   /$$  \ $$| $$_  $$ | $$| $$  | $$
                            //  |  $$$$$$/| $$ \  $$| $$| $$  | $$
                            //   \______/ |__/  \__/|__/|__/  |__/

class Skin 
{
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes/Class_fields
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Map
  static Instances  = new Map();

  //   arg =    input_item
  //         ou name (pour NULL_SKIN)
  constructor( arg ) 
  {      
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
    }
    else
    {  
      // Cas nominal: instance != Skin.NULL_SKIN
      var input_item = arg;
      assert(input_item != undefined);

      this.image_url = input_item.image ;

      var tags = input_item['tags'];

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
      var extracted_name = Skin.ExtractName(input_item.market_hash_name); 
      this.name = Skin.ExtractName(input_item.market_hash_name); 
      
      //********** DEBUG de "Skin" (cf. Bug name = this.name + dans ExtractName) **********
      // assert(this.name != "Skin");
      //********** DEBUG de "Skin" **********

      //konsole.log("B4 Skin.ExtractName:name: " + this.name);

      this.item_rarity = this.computeRarityID(input_item.item_rarity);
    } // if (arg == NULL_SKIN)

    this.created_in_db = false;
    this.updated_in_db = false;
  } // constructor()


  static ExtractName( market_hash_name )
  {
    //konsole.log("Skin.ExtractName market_hash_name: '" + market_hash_name + "'", LOG_LEVEL.MSG)
    var name = market_hash_name;
    if ( market_hash_name.search('|') != -1)
    {
      //konsole.log("Skin.ExtractName '|' trouvée", LOG_LEVEL.MSG);

      var parts = market_hash_name.split('|');

      if (parts.length > 1)
      {
        var right_part =  market_hash_name.split('|')[1];
        //   console.log("right_part: '" + right_part + "'");
        right_part = right_part.trim();
        // console.log("right_part trim: '" + right_part + "'");

        name = right_part.split('(')[0].trim(' ');

        // !!! Probléme: ' dans la valeur SQL de chaine ex: 'l'Horizon' -> 'l''Horizon'
        // !!! Solution: escape de ' rempacé par ''
        name = name.replace ("'", "''");  // Note: il y avait un Bug !! (cf. ligne suivante)
        // name = this.name.replace ("'", "''"); 
        //name = name.replace ("'", "''");
      } 
      /*
      else
      {
        konsole.log("Skin.ExtractName ELSE (parts.length <=1)", LOG_LEVEL.MSG)
      }*/
    }   
    /*
    else
    {
       konsole.log("Skin.ExtractName ELSE ('|' non trouvée)", LOG_LEVEL.MSG)
    }*/
    konsole.log("Skin.ExtractName name: '" + name + "'", LOG_LEVEL.MSG)
    return name;
  } // ExtractName()

  getType () 
  {
      return this.constructor.name ;
  } // getType()
  

  getName () 
  {
      return this.name ;
  } // getName()

  isCreatedInDB () 
  {
      return this.created_in_db ;
  }


  isUpdatedInDB () 
  {
      return this.updated_in_db ;
  }


  static executeSelectNameQuery = ( skin_obj, db, query_obj, cb ) =>
  {   
    var query_text  = expand(SQL_TEMPLATE.SELECT_NAME.value, { 'db-table': 'skin', 'db-name-value' : skin_obj.name});
    var query_obj   = BB_SqlQuery.Create( query_text );
    konsole.log("Trying SELECT_NAME in 'skin'", LOG_LEVEL.INFO);
    query_obj.execute( db, query_text );
    cb( null, skin_obj, db, query_obj);
  } // executeSelectNameQuery()


  static executeInsertQuery = ( skin_obj, db, query_obj, cb ) =>
  {   
    konsole.log("query_result\n" + JSON.stringify( query_obj.getResult() , LOG_LEVEL.CRITICAL));
    var query_text  = expand(SQL_TEMPLATE.INSERT_NAME.value, { 'db-table': 'skin', 'db-name-value': skin_obj.name } );
    var query_obj   = BB_SqlQuery.Create( query_text );
    konsole.log("Trying INSERT_NAME in 'skin'\n", LOG_LEVEL.INFO);
    query_obj.execute( db, query_text, query_obj );
  } // executeInsertQuery()
  

  // !!! Must always return a Promise
  //                requis
  createInDBTable ( db )
  { 
    assert(db != undefined);

    var SN_IN = asynk.seq( Skin.executeSelectNameQuery, Skin.executeInsertQuery);
    SN_IN
    (   this, db, null, 
        () => 
        { konsole.log("SN_IN successful !!", LOG_LEVEL.OK)
        }
    );
    // konsole.log("Skin obj.createInDBTable()", LOG_LEVEL.WARNING);

    /*
    if ( this.created_in_db )
        return new Promise
        ( ( resolve, reject ) => 
          {   konsole.log("Skin '" + this.name +  "' déjà créé dans la DB !!!  ", LOG_LEVEL.WARNING);
          } );
          */
          return Konst.RC.OK;

    //=================================================================================

/*   /$$$$$$  /$$    /$$ /$$$$$$$$  /$$$$$$        /$$$$$$$  /$$$$$$$   /$$$$$$  /$$      /$$ /$$$$$$  /$$$$$$  /$$$$$$$$
    /$$__  $$| $$   | $$| $$_____/ /$$__  $$      | $$__  $$| $$__  $$ /$$__  $$| $$$    /$$$|_  $$_/ /$$__  $$| $$_____/
    | $$  \ $$| $$   | $$| $$      | $$  \__/      | $$  \ $$| $$  \ $$| $$  \ $$| $$$$  /$$$$  | $$  | $$  \__/| $$      
    | $$$$$$$$|  $$ / $$/| $$$$$   | $$            | $$$$$$$/| $$$$$$$/| $$  | $$| $$ $$/$$ $$  | $$  |  $$$$$$ | $$$$$   
    | $$__  $$ \  $$ $$/ | $$__/   | $$            | $$____/ | $$__  $$| $$  | $$| $$  $$$| $$  | $$   \____  $$| $$__/   
    | $$  | $$  \  $$$/  | $$      | $$    $$      | $$      | $$  \ $$| $$  | $$| $$\  $ | $$  | $$   /$$  \ $$| $$      
    | $$  | $$   \  $/   | $$$$$$$$|  $$$$$$/      | $$      | $$  | $$|  $$$$$$/| $$ \/  | $$ /$$$$$$|  $$$$$$/| $$$$$$$$
    |__/  |__/    \_/    |________/ \______/       |__/      |__/  |__/ \______/ |__/     |__/|______/ \______/ |________/*/
    var query_select_obj  = BB_SqlQuery.Create();
    var query_insert_obj  = BB_SqlQuery.Create();

    var must_insert = false;

    // 1. SELECT Query
    var query_select_text = expand(SQL_TEMPLATE.SELECT_NAME.value, {'db-table' : 'skin', 'db-name-value': this.name });

    var query_select_promise = query_select_obj.executeWProm( db,  query_select_text )
    .then( result => { 
        konsole.log(query_select_obj.getCommand() + "\t successful SELECT_NAME in 'skin'", LOG_LEVEL.INFO);

        // 2. INSERT Query
        // Si l'enregistrement N'EXISTE PAS (condition: skin.name = this.name)
        // ²  -> [ [], {...} ]
        //var first_record = Skin.NULL_SKIN;
        konsole.log("result[0].length: " + result[0].length, LOG_LEVEL.MSG);
        konsole.log(JSON.stringify(result[0]), LOG_LEVEL.MSG);
        konsole.log("typeof result: " + result.constructor.name, LOG_LEVEL.MSG);

        if ( result[0].length > 0 )
        {
          konsole.log(JSON.stringify(result[0]));
          if ( result[0][0].length > 0 )
          {
            konsole.log(" Cas 1: ", LOG_LEVEL.CRITICAL);
            konsole.log(JSON.stringify(result[0][0]), LOG_LEVEL.MSG);
          }
          else
            konsole.log(" Cas 2: " + JSON.stringify(result[0][0]), LOG_LEVEL.CRITICAL);
        }
        else
        {
          konsole.log("CAS 3 result[0].length:  " + result[0].length, LOG_LEVEL.MSG);
          if (result[0].length > 1)
            konsole.log("CAS 4 result[0].length > 1 !!!  " + result[0].length, LOG_LEVEL.CRITICAL);
          must_create = true;
        }

        //query_select_obj.setResult(result);
        //konsole.log("***************** result: " + JSON.stringify(result), LOG_LEVEL.MSG);
  
        var query_insert_promise;

        if (must_insert)
        {
          var query_insert_text = expand(SQL_TEMPLATE.INSERT_NAME.value, { 'db-table': 'skin', 'db-name-value': this.name });
          query_insert_promise = query_insert_obj.execute( db,  query_insert_text );   
          return query_insert_promise;               
        }

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#Chaining
        // Note that () => x is short for () => { return x; }
        return query_select_promise;
    } )
    .then( rows => {
        konsole.log(query_insert_obj.getCommand() + "\t successful INSERT of '" + this.name + "' in 'skin'\n", LOG_LEVEL.CRITICAL);
        this.created_in_db = true;
        return query_insert_promise;
    } );

    if (must_insert)
      return query_insert_promise;               

    return query_select_promise;

/*
    // konsole.log("Skin.storeinDB() name: " + this.name, ColorConsole.LOG_LEVEL.OK );

    // INSERT INTO `skin` (name) SELECT 'Forest' FROM DUAL WHERE NOT EXISTS (SELECT name FROM skin WHERE name='Forest');
    var conditional_insert_query = "INSERT INTO `skin` (`name`) SELECT '"+ this.name + "' FROM DUAL "
                                +  "WHERE NOT EXISTS (SELECT `name` FROM `skin` WHERE `name`= '"+ this.name + "');";
               
    var query_obj     = BB_SqlQuery.Create();
    var query_promise = query_obj.execute( db_obj, conditional_insert_query )
    .then( packet => 
    {
      // https://stackoverflow.com/questions/16795097/okpacket-in-mysql-module-of-node-js
      // On recoit soit un 'OKPacket' soit un 'RowDataPacket'
      var packet_type = (typeof packet).name;
      konsole.log(query_obj.getCommand() + "  packet type : " + packet_type, LOG_LEVEL.MSG);
      // konsole.log(query_obj.getCommand() + "  PACKET : " + JSON.stringify(packet), LOG_LEVEL.MSG);
      konsole.log(query_obj.getCommand() + " successful name: '"+ this.name + "'  " + timestamp('DD_HH_mm_ss'), LOG_LEVEL.MSG);
    } );
*/
    //return query_promise ;
  } // createInDBTable()


  updateInDB (db_obj)
  {
    assert(db_obj != undefined);

    if ( this.updated_in_db == false )
        return new Promise
        ( ( resolve, reject ) => 
          {   konsole.log("Skin '" + this.name +  "' déjà UPDATE dans la DB !!!  ", LOG_LEVEL.WARNING);
          } );

    var update_query = "UPDATE `skin` SET image_url ='"+ this.image_url +"' WHERE name ='"+ this.name +"' ;" ;
                
    var query_obj = BB_SqlQuery.Create();
  
    query_obj.execute(db_obj, update_query )
    .then( rows => 
    { 
      konsole.log( "[b]" + query_obj.getCommand() + " successful name: "+ this.name + " " + timestamp('DD_HH_mm_ss') + " [/b]", LOG_LEVEL.CRITICAL);
      this.updated_in_db = true;
    });

  } // updateInDB ()


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
  static Create ( input_item )
  {
    //konsole.log("Skin.Create()", LOG_LEVEL.WARNING);
    assert(input_item != undefined);

    var new_skin = Skin.GetNullObject() ;

    konsole.log ('Skin.Instances : ' + Skin.Instances, LOG_LEVEL.OK );

    /*
    if ( Skin.Instances == undefined ) 
    {
        //console.log ('Skin Dictionnaire init') ;
        Skin.Instances = {} ;
    }*/

    var name = Skin.ExtractName( input_item.market_hash_name );

    //if (Skin.Instances.hasOwnProperty(name))
    if (Skin.Instances.get( name ) == undefined)
    {
        konsole.log ('Détection nouveau skin', LOG_LEVEL.OK) ;

        new_skin = new Skin ( input_item );
        
        //konsole.log ("Avant Insertion : '" + name + "' + Instances.count: " + Skin.Instances.size, LOG_LEVEL.OK) ;
        Skin.Instances.set( name, new_skin );
        konsole.log ("Après Insertion : '" + name + "' + Instances.count: " + Skin.Instances.size, LOG_LEVEL.OK) ;

        //konsole.log("Skin.Instances: " + utility.mapToString(Skin.Instances));
    }
    else 
    {
        konsole.log ('Skin déja créé : ' + name, LOG_LEVEL.OK );
        //new_skin = Skin.Instances[name] ;

        new_skin = Skin.Instances.get( name );

        //konsole.log("Skin.Create new_skin retrouvé: " + JSON.stringify(new_skin));
        konsole.log("Skin.Instances: count: " +  Skin.Instances.size );
        //konsole.log("Skin.Instances: Skin.Instances: \n" +  utility.mapToString(Skin.Instances), LOG_LEVEL.WARNING ); 
    }

    return new_skin ;
  } // Create()

} // Skin class
//Skin.Instances  = new Array();
Skin.NULL_SKIN ;
exports.Skin = Skin ;
//------------------------ Skin class -------------------------