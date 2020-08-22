const assert                        = require ('assert');
const Enum                          = require ('enum');
const fs                            = require ('fs')

const { BitskinsObject  }           = rekwire ('/src/model/bb_obj.js') ;
const { DataFormat      }           = rekwire ('/src/ISerializable.js')
const knex                          = rekwire ('/src/bb_database.js').knex_conn;

const Konst                         = rekwire ('/src/constants.js') ;
const Session                       = rekwire ('/src/session.js').Session ;
const { konsole, LOG_LEVEL }        = rekwire ('/src/bb_log.js'); 
const { mapToString, mapToJSON }    = rekwire ('/src/utility.js')


// * rarity, skinset, state, statTrak
// * source_sell_orders         [    0..9   ]     
// * target_sell_order_siblings [    0,->   ]
const NULL_TRADE_UP = "NULL_TRADE_UP";

class TradeUp extends BitskinsObject
{
  //                                      tradup_key -> trade_up_obj  
  static Instances                  = new Map();
  static NULL                       = TradeUp.GetNullObject();
  static LastTradeUp                = null; 

  //                                      rarity -> TargetIdToSourceIds ( target_id -> [ source_id1, source_id2, ...] )  
  static Rarity2TargetIdToSourceIds = new Map();

  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( ctx, source_decade_arg, target_siblings_arg ) 
  {     
    super ( null );
    //console.log ( 'COUCOU ')

    if (arguments.length == 3  )
    {
      this.target_siblings                      = target_siblings_arg;
      this.source_decade                        = source_decade_arg;  
      this.name                                 = TradeUp.BuildTradeUpKey ( ctx );
      this.skin_set    = ctx.params.skinset    != undefined ? ctx.params.skinset   : 5;
      this.rarity      = ctx.params.rarity     != undefined ? ctx.params.rarity    : 4;
      this.state       = ctx.params.state      != undefined ? ctx.params.state     : 4;
      this.stattrak    = ctx.params.stattrak   != undefined ? ctx.params.stattrak  : 1;
      //this._broker = Session.GetSingleton().getAppVar( Session.Broker );
    }
    else
    { // NULL object
      this.name             = NULL_TRADE_UP;
      this.target_siblings  = new Map()
      this.target_siblings.set ( Konst.NOTHING, 'Null_target_siblings_value' );
      this.source_decade = [Konst.NOTHING];
    }
  } // constructor()


  static UnitTest( ctx )
  {
    let method_name = ctx.params.method == "toJSON" ? ctx.params.method : "toJSON";
    let result = "TradeUp UnitTest OK";

    console.log( "method : '" + method_name + "'");

    if ( method_name == "toJSON" )
      try 
      {
        result =  TradeUp.NULL.toString();
        console.log ( TradeUp.NULL)
      }
      catch( err )
      {
        result = err;
      }
      
    return result;
  } // UnitTest


  getTradeUpKey ()  { return this.trade_up_key; }

  async save ( data_format = DataFormat.JSON , target = Konst.DEFAULT_JSON_OUTPUT_FILE)
  {                                   
    if ( data_format == DataFormat.MySQL )                               // array                                                     
      await knex('trade_up').insert({name : this.trade_up_obj.name, source_decade : '{ ids : ' + JSON.stringify(this.trade_up_obj.source_decade) + '}' ,
                                     target_siblings : JSON.stringify(this.trade_up_obj.target_siblings) })
    else if ( data_format == DataFormat.JSON)
    {
      if ( TradeUp.LastTradeUp == null )
      {
        let keys      = Array.from(TradeUp.Instances.keys());
        let last_key  = keys[ keys.length -1 ];
        if (last_key != undefined )
          TradeUp.LastTradeUp = TradeUp.Instances.get( last_key );
        console.log ( 'last_key : ' + last_key + ' -- LastTradeUp :' + TradeUp.LastTradeUp + 'keys.length : ' + keys.length )
      }
 
      let last_char  = ',\n';
      if ( this == TradeUp.LastTradeUp )
        last_char = ' \n]';

      fs.appendFileSync ( target, JSON.stringify(this.toJSON()) + last_char );
    }
  } // createInDBTable




  static BuildTradeUpKey( ctx )
  {
    let skin_set    = ctx.params.skinset    != undefined ? ctx.params.skinset   : 5;
    let rarity      = ctx.params.rarity     != undefined ? ctx.params.rarity    : 4;
    let state       = ctx.params.state      != undefined ? ctx.params.state     : 4;
    let stattrak    = ctx.params.stattrak   != undefined ? ctx.params.stattrak  : 1;

    //                  SourceRarity->TargetRarity/SkinSet/SkinState/HasStatTrak
    let trade_up_key = rarity + '->' + (rarity + 1) +'/' + skin_set + '/' + state + '/' + stattrak;
    return trade_up_key;
  } // BuildTradeUpKey()


  static Create( ctx, source_decade, target_siblings_by_skin_id )
  {
    let trade_up_obj = new TradeUp( ctx, source_decade, target_siblings_by_skin_id );
    let name = trade_up_obj.getName();

    if ( !  TradeUp.Instances.has ( name ) )
      TradeUp.Instances.set ( name, trade_up_obj );
    //else konsole.error( "TradeUp.Create Duplicate TradeUp name: " + name );

    return trade_up_obj;  
  } // Create() 


  static GetNullObject() 
  {
      if ( TradeUp.NULL == undefined )
      {
        TradeUp.NULL       = new TradeUp( NULL_TRADE_UP );
        TradeUp.Instances.set           ( TradeUp.NULL.name, TradeUp.NULL );
        TradeUp.InstancesByRecordID.set ( 1, TradeUp.NULL );
      }

      return TradeUp.NULL;
  } // GetNullObject() 

} // TradeUp class
exports.TradeUp = TradeUp ; 
//------------------------ BitskinsObject class -------------------------