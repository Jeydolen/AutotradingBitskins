const assert        = require ('assert');
const expand        = require ('expand-template')();

const Konst                         = rekwire ('/src/constants.js') ;
const { konsole, LOG_LEVEL }        = rekwire ('/src/bb_log.js'); 
const { BB_SqlQuery, SQL_TEMPLATE } = rekwire ('/src/bb_sql_query.js') ;
const { BB_Database, knex_conn }    = rekwire ('/src/bb_database.js') ;
const { ISerializable }             = rekwire ('/src/ISerializable.js') ;



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
class BitskinsObject extends ISerializable
{
  static Instances            = new Map();
  static InstancesByRecordID  = new Map();

  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( arg, id ) 
  {     
    super( arg );

    this._record_id            = 1; // NULL_OBJECT DANS LES TABLES 
    this._created_in_db       = false;
    this._updated_in_db       = false;
    this._table                = Konst.NOTHING;
    this._is_just_created     = true;
  } // constructor()

  toJSON = ( access_type = Konst.AccessType.Public ) => 
  {
    var json_data = {} ;
    for (var attribute in this) 
    {
      if ( ! attribute.startsWith('_'))
        {
          json_data[attribute] = this[attribute];
        }
    }
    return json_data;
  }; // toJSON()


  getIsJustCreated    ()      { return this._is_just_created;     } // getIsJustCreated()
  getType             ()      { return this.constructor.name ;    } // getType()
  getName             ()      { return this.name ;                } // getName()

  static GetFromRecordId( record_id )  
  { 
    console.log ( 'Prout' + record_id + this.name)
    var klass = this;
    var bb_obj = klass.NULL;
    if ( klass.InstancesByRecordID.has( record_id ) )
    {
      bb_obj = klass.InstancesByRecordID.get( record_id );
      console.log ('Trouvé !' + bb_obj)
    }
      
    return bb_obj;
  } // GetFromRecordId()

  getRecordId         ()      { return this._record_id;           } // getRecordId()
  setRecordId         ( record_id)      
  { 
    var klass = this.constructor;
    this._record_id = record_id; 
    klass.InstancesByRecordID.set( record_id, this );    
  } // setRecordId()

  //            optionnel (les 2)
  getCoVaSeq( json_sell_order, options_arg ) { return  Konst.NOTHING;            } // Column - value - sequence


  buildQueryText = () => 
  { 
    var query_text  = expand(SQL_TEMPLATE.SELECT_NAME.value, { 'db-table': this._table, 'db-name-value' : this.name});
    return query_text;
  } // buildQueryText()


  // implementation of 'save' service  
  save( data_format = Konst.DataFormat.Json  ) 
  {  
    
  } // ISerializable.save()


   // implementation of 'load' service  
   load( json_data  ) 
   {   
     konsole.error( "BitskinsObject.load() not implemented" );
   } // ISerializable.load()


  //-----------------------------------------------------------------------
  //-------------------------  LoadFromDBTable()  -------------------------
  //-----------------------------------------------------------------------
  static async LoadFromDBTable ( id, args )
  {
      //assert( args != undefined && args    != null );
      assert( id   != undefined && id != null && ! isNaN(id));

      var db = BB_Database.GetSingleton();

      var klass = this.name;
      console.log ('klass ' + klass + ' id :' + id );

      var table_name = klass == 
        "SkinSellOrder" ? 'skin_sell_order' :
        "SkinSet"       ? 'skin_set'        :
        "Skin"          ? 'skin'            :
        "Weapon"        ? 'weapon'          : null;

      if ( table_name == null )
      {
        konsole.error( "BitskinsObject.load(): table_name unkown " + table_name );
        return;
      }

      console.log ('table_name ' + table_name );

      var result_rows = null;
      await knex_conn.select().from( table_name )
            .where('id', id )
            .then( (rows) => {  result_rows = rows; } );

      return result_rows;
  } // ISerializable.LoadFromDBTable()
  //---------------------------------------------/>
  //-------------------------  LoadFromDBTable() />
  //---------------------------------------------/>


  //-------------------------  createInDBTable()  -------------------------
  //                   requis         requis (bitskins api)
  createInDBTable ( end_of_waterfall_cb, json_sell_order )
  { 
      assert( end_of_waterfall_cb != undefined);
      assert (json_sell_order != undefined);

      var db = BB_Database.GetSingleton(); 

      const selectQuery = () =>
      {

          var query_select_obj = BB_SqlQuery.Create();
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
          var insert_query_text  = expand(SQL_TEMPLATE.INSERT_NAME.value, { 'db-table': this._table, 'db-name-value': this.name } );
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
          this.setRecordId( insert_id );
          //                                         requis ou optionnel ?
          var assignement_value = this.getCoVaSeq( json_sell_order) ;
          if (assignement_value == Konst.NOTHING) 
          {
            afterUpdateQueryCB( null, Konst.NOTHING );
          }
          else 
          {
            var query_update_obj  = BB_SqlQuery.Create();
            var update_query_text = expand(SQL_TEMPLATE.UPDATE.value, { 'db-table': this._table, 'co-va-seq' : assignement_value, 'db-field' : 'name', 'db-field-value' : this.name });    
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