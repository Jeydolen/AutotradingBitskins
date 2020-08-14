const assert                        = require ('assert');
const Enum                          = require ('enum');

const { BitskinsObject  }           = rekwire ('/src/model/bb_obj.js') ;
const { SkinSellOrder  }            = rekwire ('/src/model/skin_sell_order.js') ;

const Konst                         = rekwire ('/src/constants.js') ;
const Session                       = rekwire ('/src/session.js').Session ;
const { konsole, LOG_LEVEL }        = rekwire ('/src/bb_log.js'); 

const _ = require('lodash');

const DataFormat      = new Enum( [ 'MySql', 'Json', 'CSV' ] );
const RarityUpgrade   = new Enum ({ 'Unknown' : 0, '1->2': 1, '2->3': 2, '3->4' : 3, '4->5' : 4, '5->6' : 5, '6-7' : 6 })


class TargetIdToSourceIds
{
  //           SellOrder Id
  constructor( target_id_arg ) 
  {     
    this.target_id  = target_id_arg;
    this.source_ids = [];
  } // constructor()1

  addSourceId( source_id_arg )
  {
    if ( this.source_ids.indexOf( source_id_arg ) == -1 ) 
      this.source_ids.push( source_id_arg );
  } // addSourceId()


  getSourceIds()
  {
      return this.source_ids;
  } // getSourceIds()


  sort()
  {
    this.source_ids = this.source_ids.sort( this.compare );
  } // sort()


  // https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
  compare( sell_order_id_A, sell_order_id_B ) 
  {
    let sell_order_obj_A = SkinSellOrder.GetFromRecordId( sell_order_id_A );
    let sell_order_obj_B = SkinSellOrder.GetFromRecordId( sell_order_id_B );

    if ( sell_order_obj_A.price < sell_order_obj_B.price ) { return -1; }
    if ( sell_order_obj_A.price > sell_order_obj_B.price ) { return  1; }
    return 0;
  } // compare()
} // TargetToSources

// * rarity, skinset, state, statTrak
// * source_sell_orders         [    0..9   ]     
// * target_sell_order_siblings [    0,->   ]                     
class TradeUp extends BitskinsObject
{
  //                                      tradup_key -> trade_up_obj  
  static Instances                  = new Map();

  //                                      rarity -> TargetIdToSourceIds ( target_id -> [ source_id1, source_id2, ...] )  
  static Rarity2TargetIdToSourceIds = new Map();

  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( ctx, target_sell_order_arg, source_sell_order_decade_arg, siblings_args = [] ) 
  {     
    super ( null );

    this.target_sell_order                  = target_sell_order_arg;
    this.target_sell_order_siblings         = siblings_args

    this.source_sell_order_decade           = source_sell_order_decade_arg;  
    
    this.skin_set    = ctx.params.skinset    != undefined ? ctx.params.skinset   : 5;
    this.rarity      = ctx.params.rarity     != undefined ? ctx.params.rarity    : 4;
    this.state       = ctx.params.state      != undefined ? ctx.params.state     : 4;
    this.stattrak    = ctx.params.stattrak   != undefined ? ctx.params.stattrak  : 1;

    this._broker = Session.GetSingleton().getAppVar( Session.Broker );
  } // constructor()


  getSourceRarity() { return this.rarity; }

  static getRealTradeUps( target_rows )
  {
      //                           R1-R2 / StatTrak etc...
      //                       ex: 2->3 : [ alternative_targets ]  
      // key:            
      let real_trade_ups = new Map();

      target_rows.map
      (
          ( target ) =>
          {
            let target_sources = potential_profitable_trade_ups.get ( target );

            target_rows.map
            (
              ( alternative_target ) =>
              {
                  if ( alternative_target != target )
                  {
                    let alternative_target_sources = potential_profitable_trade_ups.get ( alternative_target );
                    if ( _.isEqual ( target_sources, alternative_target_sources) )
                    {
                      real_trade_ups.set( )
                    }
                  }

              }
            )
          }
      )
  }; // getRealTradeUps()


  getTradeUpKey()
  {
    let trade_up_key = this.source_sell_order_id + '==>' + this.target_sell_order_id;
    return trade_up_key;
  } // getTradeUpKey()


  //                            rarity      target_rarity = rarity + 1
  //                         ex: 1              ==> 2
  // static Create ( json_data, rarity  )
  static Create( ctx, target_sell_order, source_sell_order_decade )
  {
    let trade_up_obj = new TradeUp( ctx, target_sell_order, source_sell_order_decade );
    TradeUp.Instances.set ( trade_up_obj.getTradeUpKey(), trade_up_obj );
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

} // TradeUp class
exports.TradeUp = TradeUp ; 
//------------------------ BitskinsObject class -------------------------