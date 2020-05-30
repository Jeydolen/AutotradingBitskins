const assert      = require ('assert');
const expand      = require ('expand-template')();



const Konst       = require ('./constants.js') ;
const LOG_LEVEL   = require ('./bb_log.js').LOG_LEVEL; 
const konsole     = require ('./bb_log.js').konsole ;
const BB_SqlQuery = require ('./bb_sql_query.js').BB_SqlQuery ;
const SQL_TEMPLATE = require('./bb_sql_query.js').SQL_TEMPLATE;
const QUERY_STATE = require ('./bb_sql_query.js').QUERY_STATE;


/*
 /$$$$$$$  /$$   /$$              /$$       /$$                      /$$$$$$  /$$                                 /$$    
| $$__  $$|__/  | $$             | $$      |__/                     /$$__  $$| $$                                | $$    
| $$  \ $$ /$$ /$$$$$$   /$$$$$$$| $$   /$$ /$$ /$$$$$$$   /$$$$$$$| $$  \ $$| $$$$$$$  /$$  /$$$$$$   /$$$$$$$ /$$$$$$  
| $$$$$$$ | $$|_  $$_/  /$$_____/| $$  /$$/| $$| $$__  $$ /$$_____/| $$  | $$| $$__  $$|__/ /$$__  $$ /$$_____/|_  $$_/  
| $$__  $$| $$  | $$   |  $$$$$$ | $$$$$$/ | $$| $$  \ $$|  $$$$$$ | $$  | $$| $$  \ $$ /$$| $$$$$$$$| $$        | $$    
| $$  \ $$| $$  | $$ /$$\____  $$| $$_  $$ | $$| $$  | $$ \____  $$| $$  | $$| $$  | $$| $$| $$_____/| $$        | $$ /$$
| $$$$$$$/| $$  |  $$$$//$$$$$$$/| $$ \  $$| $$| $$  | $$ /$$$$$$$/|  $$$$$$/| $$$$$$$/| $$|  $$$$$$$|  $$$$$$$  |  $$$$/
|_______/ |__/   \___/ |_______/ |__/  \__/|__/|__/  |__/|_______/  \______/ |_______/ | $$ \_______/ \_______/   \___/  
                                                                                  /$$  | $$                              
                                                                                 |  $$$$$$/                              
                                                                                  \______/         */
class BitskinsObject 
{
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes/Class_fields
  // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Map
  // http://thecodebarbarian.com/static-properties-in-javascript-with-inheritance.html
  static Instances  = new Map();

  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( arg ) 
  {     
    this.record_id            = Konst.NOTHING; 
    this._create_query_state  = QUERY_STATE.UNKNOWN;
    this._update_query_state  = QUERY_STATE.UNKNOWN;
    this._created_in_db       = false;
    this._updated_in_db       = false;
    this.table                = Konst.NOTHING;
  } // constructor()


  setCreateQueryState (value) { this._create_query_state = value; }
  getCreateQueryState ()      { return this._create_query_state;  }
  getIsCreatedInDB    ()      { return this._created_in_db ;      }
  setIsCreatedInDB    (value) { this._created_in_db = value;      }


  setUpdateQueryState (value) { this._update_query_state = value; }
  getUpdateQueryState ()      { return this._update_query_state;  }
  getIsUpdatedInDB    ()      { return this._updated_in_db ;      }
  setIsUpdatedInDB    (value) { this._updated_in_db = value;      }


  getType ()       { return this.constructor.name ; } // getType()
  
  getName ()       { return this.name ; } // getName()

  getCoVaSeq () { return  Konst.NOTHING; } // Column - value - sequence


  //                requis
  createInDBTable ( db )
  { 
      
      assert(db != undefined);

      const selectQuery = () =>
      {
        var query_select_obj = BB_SqlQuery.Create();
        konsole.log( this.getType() +".createInDBTable() SELECT");
        var query_text  = expand(SQL_TEMPLATE.SELECT_NAME.value, { 'db-table': this.table, 'db-name-value' : this.name});
        //konsole.log("Trying SELECT_NAME in '" + this.table + "'", LOG_LEVEL.INFO);
        this.setCreateQueryState( QUERY_STATE.PENDING );
        query_select_obj.executeWithCB( db, query_text, insertQueryCB );

      }; // selectQuery()


      const  insertQueryCB = (err,  query_select_result) =>
      {
        this.query_result = query_select_result ;

        var query_insert_obj = BB_SqlQuery.Create();
        assert (query_select_result[0].length <= 1 ); // SI plus de 1 on a merdé

        if ( query_select_result[0].length == 0)
        {
          var insert_query_text  = expand(SQL_TEMPLATE.INSERT_NAME.value, { 'db-table': this.table, 'db-name-value': this.name } );
          konsole.log ("-----------BBOBJ Avant insert (WC)" + insert_query_text, LOG_LEVEL.STEP);
          query_insert_obj.executeWithCB( db, insert_query_text, updateQueryCB );
          konsole.log ("------------BBOBJ Apres insert (WC)" + insert_query_text, LOG_LEVEL.OK);
        }
        else 
          konsole.log ("BB_Obj Déja créé BLYAT", LOG_LEVEL.WARNING); 
      }; // insertQueryCB()


      const updateQueryCB = ( err, query_insert_result ) =>
      {

        if (err)
          konsole.log ("ERREURRE" + err, LOG_LEVEL.CRITICAL);
        if (this.getCoVaSeq() == Konst.NOTHING) 
            return Konst.RC.OK;
        
        konsole.log ('INSERT RESULT :' + query_insert_result);
        var query_update_obj  = BB_SqlQuery.Create();
        var update_query_text = expand(SQL_TEMPLATE.UPDATE.value, { 'db-table': this.table, 'co-va-seq' : this.getCoVaSeq(), 'db-field' : 'name', 'db-field-value' : this.name });     
        konsole.log("Trying update of '" + this.name + "' in '" + this.table + "'", LOG_LEVEL.INFO);
        query_update_obj.executeWithCB(db, update_query_text, afterUpdateQueryCB );
        //konsole.log ('Query text update : ' + update_query_text, LOG_LEVEL.INFO)
      }; // updateQuery()


      const afterUpdateQueryCB = (err, query_update_result) =>
      {   
        //konsole.log("Skin.afterInsertQueryCB", LOG_LEVEL.OK);  
        assert (this.getCreateQueryState () == QUERY_STATE.PENDING );

        if (err)
        {
          this.setCreateQueryState( QUERY_STATE.FAILED );
          konsole.log ('Houston on a un prbl : ' +err, LOG_LEVEL.ERROR); 
        }
        else 
        {
          this.setCreateQueryState( QUERY_STATE.DONE );
          this.setIsCreatedInDB   ( true );
        }
          
      }; // afterInsertQueryCB()


      // 1. UNKNOWN --> 2. PENDING --> 3. DONE / FAILED 
      if (  this.getCreateQueryState () == QUERY_STATE.UNKNOWN )
          selectQuery();

      return Konst.RC.OK;

  } // createInDBTable()

} // BitskinsObject class
exports.BitskinsObject = BitskinsObject ;
//------------------------ BitskinsObject class -------------------------