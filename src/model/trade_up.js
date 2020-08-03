const assert        = require ('assert');
const Enum                = require ('enum');
const { BitskinsObject }  = require('./bb_obj');

const Konst                         = rekwire ('/src/constants.js') ;
const Session                       = rekwire ('/src/session.js').Session ;
const { konsole, LOG_LEVEL }        = rekwire ('/src/bb_log.js'); 

const DataFormat = new Enum( [ 'MySql', 'Json', 'CSV' ] );
const RarityUpgrade   = new Enum ({ 'Unknown' : 0, '1->2': 1, '2->3': 2, '3->4' : 3, '4->5' : 4, '5->6' : 5, '6-7' : 6 })

class TradeUp extends BitskinsObject
{
  static Instances      = new Map();
  static Rarity2Target2Sources = new Map();

  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( json_data, source_rarity ) 
  {     
    super ( json_data )
    this.source_rarity = source_rarity;
    this.source_sell_order_id = json_data.SQ1_id;
    this.target_sell_order_id = json_data.SQ2_id;
    this._broker = Session.GetSingleton().getAppVar( Session.Broker );
    this.init();
  } // constructor()

  init()
  {
    this._broker.call( "skin_sell_order.list", { id: this.source_sell_order_id + "|" + this.target_sell_order_id } );
  } // init

  getKey()
  {
    var map_key = this.source_sell_order_id + '==>' + this.target_sell_order_id;
    return map_key;
  } // getKey()

  static Create ( json_data, source_rarity  )
  {
    var trade_up_obj = new TradeUp( json_data, source_rarity )
    TradeUp.Instances.set ( trade_up_obj.getKey() , trade_up_obj );
 
    //    RarityTarget2Sources
    // Rarity -> Target -> Sources
    if ( ! TradeUp.Rarity2Target2Sources.has ( source_rarity ) ) 
        TradeUp.Rarity2Target2Sources.set ( source_rarity, new Map() ) ;

    // 2. target_sell_order_id --> [ source_target_ids ]
    var target_map = TradeUp.Rarity2Target2Sources.get ( source_rarity );
    var target_key = trade_up_obj.target_sell_order_id;
    var source_key = trade_up_obj.source_sell_order_id;

    if ( ! target_map.has ( target_key ) ) 
      target_map.set ( target_key, [] ) ;

    var source_array = target_map.get ( target_key )
    if ( source_array.indexOf( source_key) == -1 )              
      source_array.push( source_key );

    return trade_up_obj;  
  } // Create() 

  static GetRarityUpgradeFromValue ( value )
  {
    var rarity_upgrade_key = RarityUpgrade.get(value)
    return  rarity_upgrade_key;
  }


  load( data ) 
  {   
    assert( data != undefined  &&  data != null );
  } // load()


  save( data_format, data  ) 
  { 
  } // load()

} // TradeUp class
exports.TradeUp = TradeUp ;

//------------------------ BitskinsObject class -------------------------