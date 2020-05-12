const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const async_npm = require ('async');


const db = require ('./db.js');
const BB_Database = require ('./sql_utilities.js').BB_Database;
const rdp = require('./rechercheduprofit.js');
const B_L = require ('./business-logic.js');
const sql_u = require ('./sql_utilities')
const konsole   = require('./bb_log.js').konsole;
const LOG_LEVEL = require('./bb_log.js').LOG_LEVEL;



const ERROR_NO_DATA = "NO_DATA";

//var jsonData = ERROR_NO_DATA;
var jsonObj = ERROR_NO_DATA;




// http://www.patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20

/*----------------------------------------------------------------------------------------------------------------------

/  \    /  \ ____ |  |   ____  ____   _____   ____   _/  |_  ____   _/  |_|  |__   ____     ____  ____   __| _/____  
\   \/\/   // __ \|  | _/ ___\/  _ \ /     \_/ __ \  \   __\/  _ \  \   __\  |  \_/ __ \  _/ ___\/  _ \ / __ |/ __ \ 
 \        /\  ___/|  |_\  \__(  <_> )  Y Y  \  ___/   |  | (  <_> )  |  | |   Y  \  ___/  \  \__(  <_> ) /_/ \  ___/ 
  \__/\  /  \___  >____/\___  >____/|__|_|  /\___  >  |__|  \____/   |__| |___|  /\___  >  \___  >____/\____ |\___  >
       \/       \/          \/            \/     \/                            \/     \/       \/           \/    \/ 
----------------------------------------------------------------------------------------------------------------------*/
//var skin_sell_orders = [];

 







// https://davidwells.io/snippets/forcing-async-functions-to-sync-in-node