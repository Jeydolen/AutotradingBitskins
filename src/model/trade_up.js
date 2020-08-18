const assert                        = require ('assert');
const Enum                          = require ('enum');

const { BitskinsObject  }           = rekwire ('/src/model/bb_obj.js') ;
const { SkinSellOrder  }            = rekwire ('/src/model/skin_sell_order.js') ;

const Konst                         = rekwire ('/src/constants.js') ;
const Session                       = rekwire ('/src/session.js').Session ;
const { konsole, LOG_LEVEL }        = rekwire ('/src/bb_log.js'); 
const { mapToString, mapToJSON }    = rekwire ('/src/utility.js')

const DataFormat      = new Enum( [ 'MySql', 'Json', 'CSV' ] );
const RarityUpgrade   = new Enum ({ 'Unknown' : 0, '1->2': 1, '2->3': 2, '3->4' : 3, '4->5' : 4, '5->6' : 5, '6-7' : 6 })


// * rarity, skinset, state, statTrak
// * source_sell_orders         [    0..9   ]     
// * target_sell_order_siblings [    0,->   ]
const NULL_TRADE_UP = "NULL_TRADE_UP";

class TradeUp extends BitskinsObject
{
  //                                      tradup_key -> trade_up_obj  
  static Instances                  = new Map();
  static NULL = TradeUp.GetNullObject();

  //                                      rarity -> TargetIdToSourceIds ( target_id -> [ source_id1, source_id2, ...] )  
  static Rarity2TargetIdToSourceIds = new Map();

  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( ctx, source_decade_arg, target_siblings_arg ) 
  {     
    super ( null );
    console.log ( 'COUCOU ')

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
      this.target_siblings.set ( 'Null_key', 'Null_trade_ups_targets_siblings_prout_prout_value' )
    }
   
  } // constructor()


  getTradeUpKey ()  { return this.trade_up_key; }


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
    else
      konsole.error( "TradeUp.Create Duplicate TradeUp name: " + name );
    return trade_up_obj;  
  } // Create() 


  static GetRarityUpgradeFromValue ( value )
  {
    let rarity_upgrade_key = RarityUpgrade.get(value)
    return  rarity_upgrade_key;
  } // GetRarityUpgradeFromValue()


  load( data ) 
  {   
    assert( data != undefined  &&  data != null );
  } // load()


  save( data_format, data  ) 
  { 
  } // save()


  static GetNullObject() 
  {
      if ( TradeUp.NULL == undefined )
      {
        TradeUp.NULL   = new TradeUp( NULL_TRADE_UP );
        TradeUp.Instances.set           ( TradeUp.NULL.name, TradeUp.NULL );
        TradeUp.InstancesByRecordID.set ( 1, TradeUp.NULL );
      }

      return TradeUp.NULL;
  } // GetNullObject() 

} // TradeUp class
exports.TradeUp = TradeUp ; 
//------------------------ BitskinsObject class -------------------------