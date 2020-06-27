const assert        = require ('assert');
const expand        = require ('expand-template')();

const Konst                         = rekwire ('/src/constants.js') ;
const { konsole, LOG_LEVEL }        = rekwire ('/src/bb_log.js'); 
const { BB_SqlQuery, SQL_TEMPLATE } = rekwire ('/src/bb_sql_query.js') ;


/*$$$$$$$  /$$   /$$              /$$       /$$                      /$$$$$$  /$$                                 /$$    
| $$__  $$|__/  | $$             | $$      |__/                     /$$__  $$| $$                                | $$    
| $$  \ $$ /$$ /$$$$$$   /$$$$$$$| $$   /$$ /$$ /$$$$$$$   /$$$$$$$| $$  \ $$| $$$$$$$  /$$  /$$$$$$   /$$$$$$$ /$$$$$$  
| $$$$$$$ | $$|_  $$_/  /$$_____/| $$  /$$/| $$| $$__  $$ /$$_____/| $$  | $$| $$__  $$|__/ /$$__  $$ /$$_____/|_  $$_/  
| $$__  $$| $$  | $$   |  $$$$$$ | $$$$$$/ | $$| $$  \ $$|  $$$$$$ | $$  | $$| $$  \ $$ /$$| $$$$$$$$| $$        | $$    
| $$  \ $$| $$  | $$ /$$\____  $$| $$_  $$ | $$| $$  | $$ \____  $$| $$  | $$| $$  | $$| $$| $$_____/| $$        | $$ /$$
| $$$$$$$/| $$  |  $$$$//$$$$$$$/| $$ \  $$| $$| $$  | $$ /$$$$$$$/|  $$$$$$/| $$$$$$$/| $$|  $$$$$$$|  $$$$$$$  |  $$$$/
|_______/ |__/   \___/ |_______/ |__/  \__/|__/|__/  |__/|_______/  \______/ |_______/ | $$ \_______/ \_______/   \___/  
                                                                                  /$$  | $$                              
                                                                                 |  $$$$$$/                              
                                                                                  \_____*/
class BitskinsObject 
{
  static Instances  = new Map();

  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( arg ) 
  {     
    this._record_id            = 1; // NULL_OBJECT DANS LES TABLES 
    this._created_in_db       = false;
    this._updated_in_db       = false;
    this.table                = Konst.NOTHING;
    this._is_just_created     = true;
  } // constructor()


  getIsJustCreated    ()      { return this._is_just_created;     } // getIsJustCreated()
  getType             ()      { return this.constructor.name ;    } // getType()
  getName             ()      { return this.name ;                } // getName()
  getRecordId         ()      { return this._record_id;           } // getRecordId()

  //            optionnel
  getCoVaSeq(json_sell_order) { return  Konst.NOTHING;            } // Column - value - sequence

  buildQueryText = () => 
  { 
    var query_text  = expand(SQL_TEMPLATE.SELECT_NAME.value, { 'db-table': this.table, 'db-name-value' : this.name});
    return query_text;
  } // buildQueryText()


  //                requis        requis            requis
  createInDBTable (  db,    end_of_waterfall_cb, json_sell_order )
  { 
      assert( db != undefined );
      assert( end_of_waterfall_cb != undefined);
      assert (json_sell_order != undefined);

      const selectQuery = () =>
      {

          var query_select_obj = BB_SqlQuery.Create();
          //konsole.log( this.getType() +".createInDBTable() SELECT");
          
          var query_text = this.buildQueryText();
          query_select_obj.executeWithCB( db, query_text, insertQueryCB );
        
      }; // selectQuery()


      const  insertQueryCB = ( err,  query_select_result ) =>
      {
        this.query_result = query_select_result ;

        
        var query_insert_obj = BB_SqlQuery.Create();
  
        if ( err )
        {
          konsole.error ("BB_Obj error: " + err, LOG_LEVEL.CRITICAL); 
          return Konst.RC.KO;
        }
        
        assert (query_select_result[0].length <= 1 ); // SI plus de 1 on a merdé

        if ( query_select_result[0].length == 0)
        {
          var insert_query_text  = expand(SQL_TEMPLATE.INSERT_NAME.value, { 'db-table': this.table, 'db-name-value': this.name } );
          query_insert_obj.executeWithCB( db, insert_query_text, updateQueryCB );
        }
        else 
        {
          konsole.log ("Cet objet est déja inséré dans la DB: " + this.name , LOG_LEVEL.INFO);
          afterUpdateQueryCB( null, Konst.NOTHING );
        }      
      }; // insertQueryCB()


      const updateQueryCB = ( err, query_insert_result ) =>
      {
        if ( err )
        {
          konsole.log ("BB_Obj ERREURE: " + err, LOG_LEVEL.CRITICAL); 
          afterUpdateQueryCB( null, Konst.NOTHING );
          return Konst.RC.KO;
        }     
        else
        {

          var   insert_id = query_insert_result[0].insertId;
          this._record_id = insert_id;
          //                                         requis ou optionnel ?
          var assignement_value = this.getCoVaSeq( json_sell_order) ;
          if (assignement_value == Konst.NOTHING) 
          {
            afterUpdateQueryCB( null, Konst.NOTHING );
          }
          else 
          {
            var query_update_obj  = BB_SqlQuery.Create();
            var update_query_text = expand(SQL_TEMPLATE.UPDATE.value, { 'db-table': this.table, 'co-va-seq' : assignement_value, 'db-field' : 'name', 'db-field-value' : this.name });    
            query_update_obj.executeWithCB(db, update_query_text, afterUpdateQueryCB );
          }
        }
      }; // updateQuery()


      const afterUpdateQueryCB = ( err, query_update_result ) =>
      {   

        if ( err )
        {
          konsole.error ('BB_OBJ.afterUpdateQueryCB() Houston on a un prbl : ' + err ); 
        }
        end_of_waterfall_cb( this );   // increment 
      }; // afterInsertQueryCB()


      //===============================================================================================
      // 1. UNKNOWN --> 2. PENDING --> 3. DONE / FAILED 
      var item_type = json_sell_order.item_type;
      if (item_type == "Container" || item_type == "Sticker" || item_type == "Agent" || item_type == "Gloves")
        end_of_waterfall_cb( this );

      else if (  this.getIsJustCreated () )
        selectQuery();

      else
        end_of_waterfall_cb( this );

      return Konst.RC.OK;

  } // createInDBTable()

} // BitskinsObject class
exports.BitskinsObject = BitskinsObject ;
//------------------------ BitskinsObject class -------------------------