const assert      = require ('assert');
const timestamp   = require ('time-stamp');
const expand      = require ('expand-template')();
const asynk       = require ('async');


const pause       = require ('./utility.js').pause;
const Konst       = require ('./constants.js') ;
const LOG_LEVEL   = require ('./bb_log.js').LOG_LEVEL; 
const konsole     = require ('./bb_log.js').konsole ;
const BB_SqlQuery = require ('./bb_sql_query.js').BB_SqlQuery ;
const SQL_TEMPLATE = require('./bb_sql_query.js').SQL_TEMPLATE;
const utility     = require ('./utility.js') ;
const QUERY_STATE = require ('./bb_sql_query.js').QUERY_STATE;

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

    this.create_query_state  = QUERY_STATE.UNKNOWN;
    this.update_query_state  = QUERY_STATE.UNKNOWN;

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
    } // if (arg == NULL_SKIN)I

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
        right_part = right_part.trim();
        name = right_part.split('(')[0].trim(' ');

        // !!! Probléme: ' dans la valeur SQL de chaine ex: 'l'Horizon' -> 'l''Horizon'
        // !!! Solution: escape de ' rempacé par ''
        name = name.replace ("'", "''");
      } 

    }
    //konsole.log("Skin.ExtractName name: '" + name + "'", LOG_LEVEL.MSG)
    return name;
  } // ExtractName()

  getType ()       { return this.constructor.name ; } // getType()
  
  getName ()       { return this.name ; } // getName()

  isCreatedInDB () { return this.created_in_db ; }
  
  isUpdatedInDB () { return this.updated_in_db ; }


  // !!! Must always return a Promise
  //                requis
  createInDBTable ( db )
  { 
      
      assert(db != undefined);

      const selectQuery = () =>
      {
        var query_select_obj = BB_SqlQuery.Create();
        konsole.log("Skin.createInDBTable() SELECT");
        var query_text  = expand(SQL_TEMPLATE.SELECT_NAME.value, { 'db-table': 'skin', 'db-name-value' : this.name});
        konsole.log("Trying SELECT_NAME in 'skin'", LOG_LEVEL.INFO);
        this.create_query_state = QUERY_STATE.PENDING;
        query_select_obj.executeWithCB( db, query_text, insertQueryCB );

      }; // selectQuery()


      const  insertQueryCB = (err,  query_select_result) =>
      {
        this.query_result = query_select_result ;

        var query_insert_obj = BB_SqlQuery.Create();
        //konsole.log("Skin.insertQueryCB result: " + JSON.stringify(query_select_result) + "\n Longueur de l'array " + query_select_result[0].length, LOG_LEVEL.OK);

        assert (query_select_result[0].length <= 1 ); // SI plus de 1 on a merdé

        if ( query_select_result[0].length == 0)
        {
          var query_text  = expand(SQL_TEMPLATE.INSERT_NAME.value, { 'db-table': 'skin', 'db-name-value': this.name } );
          konsole.log("Trying INSERT_NAME in 'skin'\n", LOG_LEVEL.MSG);
          query_insert_obj.executeWithCB( db, query_text, afterInsertQueryCB );
        }
        else 
          konsole.log ("Déja créé BLYAT", LOG_LEVEL.WARNING); 
      }; // insertQueryCB()


      const afterInsertQueryCB = (err, query_insert_result) =>
      {
          
        //konsole.log("Skin.afterInsertQueryCB", LOG_LEVEL.OK);
            
        assert (this.create_query_state == QUERY_STATE.PENDING);

        if (err)
        {
          this.create_query_state   = QUERY_STATE.FAILED
          konsole.log ('Houston on a un prbl : ' +err, LOG_LEVEL.ERROR); 
        }
        else 
        {
          this.create_query_state    = QUERY_STATE.DONE;
          this.created_in_db  = true;
        }
          
      }; // afterInsertQueryCB()


      // 1. UNKNOWN --> 2. PENDING --> 3. DONE / FAILED 
      if (this.create_query_state == QUERY_STATE.UNKNOWN)
          selectQuery();

      return Konst.RC.OK;

  } // createInDBTable()


  //           requis       optionnel
  updateInDB (db_obj,       override)
  {
    assert(db_obj != undefined);


    const updateQuery = () =>
    {
      var query_update_obj = BB_SqlQuery.Create();
      var update_query_text = expand(SQL_TEMPLATE.UPDATE_STR.value, { 'db-table': 'skin', 'db-field' : "image_url", 'db-field-value' : this.image_url, 'db-name-value' : this.name });     
      konsole.log("Trying update in 'skin'", LOG_LEVEL.INFO);
      this.update_query_state = QUERY_STATE.PENDING;
      query_update_obj.executeWithCB(db_obj, update_query_text, afterUpdateCB );

    }; // updateQuery()


    const afterUpdateCB = (err, query_update_result) =>
    {
      //konsole.log("Skin.afterUpdateCB", LOG_LEVEL.OK);
                  
      assert (this.update_query_state == QUERY_STATE.PENDING);

      if (err)
      {
        this.update_query_state = QUERY_STATE.FAILED
        konsole.log ('Houston on a un prbl : ' +err, LOG_LEVEL.ERROR); 
      }
      else 
      {
        this.update_query_state     = QUERY_STATE.DONE;
        this.updated_in_db          = true;
      }
    }

    if (this.update_query_state == QUERY_STATE.UNKNOWN)
      updateQuery();
    return Konst.RC.OK;
    
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
    if (  Skin.Instances.get( name )  == undefined  || Skin.Instances.get (name) === undefined 
      ||  Skin.Instances.get (name)   === null      || Skin.Instances.get (name) == null)
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