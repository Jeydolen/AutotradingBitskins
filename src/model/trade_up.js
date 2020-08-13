const assert                        = require ('assert');
const Enum                          = require ('enum');

const { BitskinsObject  }           = rekwire ('/src/model/bb_obj.js') ;
const { SkinSellOrder  }            = rekwire ('/src/model/skin_sell_order.js') ;

const Konst                         = rekwire ('/src/constants.js') ;
const Session                       = rekwire ('/src/session.js').Session ;
const { konsole, LOG_LEVEL }        = rekwire ('/src/bb_log.js'); 

const _ = require('lodash');

const DataFormat = new Enum( [ 'MySql', 'Json', 'CSV' ] );
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

  /*
  getSourceIdCount()
  {
    return this.source_ids.length;
  } // getSourceIdCount

  getSourceId( index )
  {
    if ( index > 0  &&  index < this.getSourceIdCount() )
    {
      return this.source_ids[ index ];
    }
  } // getSourceId()
  */

  sort()
  {
    this.source_ids = this.source_ids.sort( this.compare );
  } // getSourceId()


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


class TradeUp extends BitskinsObject
{
  //                                      tradup_key -> trade_up_obj  
  static Instances                  = new Map();

  //                                      rarity -> TargetIdToSourceIds ( target_id -> [ source_id1, source_id2, ...] )  
  static Rarity2TargetIdToSourceIds = new Map();

  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( json_data, source_rarity ) 
  {     
    super ( json_data )
    this.source_rarity = source_rarity;
    this.source_sell_order_id = json_data.SQ1_id;
    this.target_sell_order_id = json_data.SQ2_id;
    this._broker = Session.GetSingleton().getAppVar( Session.Broker );
  } // constructor()

  getSourceRarity() { return this.source_rarity; }
  getSourceId()     { return this.source_sell_order_id; }
  getTargetId()     { return this.target_sell_order_id; }

  
  async init()
  {
    //this._broker.call( "skin_sell_order.list", { id: this.source_sell_order_id + "|" + this.target_sell_order_id } );
    let ids = [ this.source_sell_order_id, this.target_sell_order_id ];
    await BitskinsObject.GetObjectsFromRecordIDs( ids, SkinSellOrder );
  } // init.


  static SortSellOrderByPrice = ( sell_order_1, sell_order_2 ) =>
  {
      if      ( sell_order_1.price > sell_order_2.price ) return  ;
      else if ( sell_order_1.price < sell_order_2.price ) return -1;
      else                                                return 0;
  }; // SortSourcesByPrice



  static ExtractPotentialProfitableTradeUps ( target_rows, source_rows)
  {
      let trade_ups = new Map();
      let potential_profitable_trade_ups = new Map();
      let sources = null;

      target_rows.map
      (
          ( target ) =>
          {
              sources = [];
              source_rows.map
              (
                  ( source ) =>
                  {
                      //if ( source.price * trade_up_profit_ratio <= target.price  )
                      {
                          //konsole.warn( source.id + " (" + source.price + ")  =>  " + target.id + " (" + target.price + ")");

                          if ( ! trade_ups.has( target.id ) )
                          {
                              // konsole.log(" adding id: " + target.SQ2_id );
                              trade_ups.set( target.id, [] );
                          }

                          let source_ids = trade_ups.get( target.id );

                          if ( source_ids.indexOf( source.id ) == -1 )
                          {
                              source_ids.push( source.id );
                              sources.push( source );
                          }
                      }
                  }
              ); // source_rows.map()

              sources.sort ( TradeUp.SortSellOrderByPrice );

              if ( sources.length >= 10)
              {
                  let total_investment = 0.00;

                  for ( let i = 0; i < 10; i++)
                  {
                      let source = sources[1];
                      total_investment += source.price;
                  }
                  if ( total_investment <= target.price )
                  {
                      let profit_margin = ( target.price - total_investment )/ total_investment * 100.00;
                      console.log ( "C'est bien, rentabilité potentielle :" + profit_margin +' % ' + target.market_name );
                      potential_profitable_trade_ups.set( target, sources.slice( 0, 10 ) ) ;
                      console.log (' --------------------------------------------------- \n' );
                  }
                  else 
                  {
                      potential_profitable_trade_ups.set( target, [] ) ;
                  }
                      
              }
              else { console.log ('Pas assez de source sellOrder' )}
          }
      ); // target_rows.map

      return potential_profitable_trade_ups;
  } // ExtractPotentialProfitableTradeUps()


  static getRealTradeUps( target_rows )
  {
      //                           R1-R2 / StatTrak etc...
      //                       ex: 2->3 : [ alternative_targets ]             
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

  //                             source_rarity      target_rarity = source_rarity + 1
  //                         ex: 1              ==> 2
  static Create ( json_data, source_rarity  )
  {
    let trade_up_obj = new TradeUp( json_data, source_rarity )
    TradeUp.Instances.set ( trade_up_obj.getTradeUpKey(), trade_up_obj );
 
    // Rarity -> Target2Sources
    if ( ! TradeUp.Rarity2TargetIdToSourceIds.has ( source_rarity ) ) 
        TradeUp.Rarity2TargetIdToSourceIds.set ( source_rarity, new Map() ) ;

    // 2. target_sell_order_id --> [ source_target_ids ]-
    let target_map  = TradeUp.Rarity2TargetIdToSourceIds.get ( source_rarity );
    let target_id   = trade_up_obj.target_sell_order_id;
    let source_id   = trade_up_obj.source_sell_order_id;

    if ( ! target_map.has ( target_id ) ) 
      target_map.set ( target_id, new TargetIdToSourceIds( target_id ) ) ;

    //  target_id -> [ source_id1, source_id2, ...]
    let target_id_2_source_ids = target_map.get ( target_id )
    target_id_2_source_ids.addSourceId( source_id );            

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