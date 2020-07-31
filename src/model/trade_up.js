const assert        = require ('assert');
const Enum          = require ('enum');

const Konst                         = rekwire ('/src/constants.js') ;
const Session                       = rekwire ('/src/session.js').Session ;
const { konsole, LOG_LEVEL }        = rekwire ('/src/bb_log.js'); 

const DataFormat = new Enum( [ 'MySql', 'Json', 'CSV' ] );


class TradeUp 
{
  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( json_data ) 
  {     
    this.source_sell_order_id = json_data.SQ1_id;
    this.target_sell_order_id = json_data.SQ2_id;
    this._broker = Session.GetSingleton().getAppVar( Session.Broker );
    console.log ('Donnez moi de la moulaga ' + this.source_sell_order_id +', ' + this.target_sell_order_id)
    this.init();
  } // constructor()


  init()
  {
    this._broker.call( "skin_sell_order.list", { id: this.source_sell_order_id + "|" + this.target_sell_order_id } );
  } // init


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