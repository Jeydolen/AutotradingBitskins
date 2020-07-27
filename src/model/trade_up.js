const assert        = require ('assert');
const Enum          = require ('enum');

const Konst                         = rekwire ('/src/constants.js') ;
const { konsole, LOG_LEVEL }        = rekwire ('/src/bb_log.js'); 

const DataFormat = new Enum( [ 'MySql', 'Json', 'CSV' ] );


class TradeUp 
{
  //   arg =    input_item ou name (pour NULL_SKIN)
  constructor( json_data ) 
  {     
    this.source_sell_order = json_data.source_sell_order;
    this.target_sell_order = json_data.target_sell_order;
  } // constructor()


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