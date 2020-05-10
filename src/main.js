const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const commander = require('commander');
const async_npm = require ('async');


const http_server = require ('./httpserver.js');
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


const updateDb = () => 
{
    db.clearTables();
  
    async_npm.until( 
      function test(cb) 
      {
        // console.log("exitFetchItems: " + exitFetchItems);
        cb(null, exitFetchItems); 
      },
  
      function iter(cb) 
      {
        //ItemsCount = 0;
        MxI.$Log.write("Traitementde la page : " + page_index, LOG_LEVEL.MSG);
        rdp.fetchItems( page_index, B_L.parseOnResponseReady );
        // console.log("avant pause de 6 sec");
        var page_ready = setTimeout(cb, 6000); 
        page_index++;
      },
  
      // End
      function (err) 
      {
        // All things are done!
        MxI.$Log.write("Main.updateDB() : Fin de traitement des pages.", LOG_LEVEL.MSG);
       }
    ); // async.whilst()

}; // updateDb ()

// http://www.patorjk.com/software/taag/#p=display&f=Graffiti&t=Type%20Something%20

/*----------------------------------------------------------------------------------------------------------------------

/  \    /  \ ____ |  |   ____  ____   _____   ____   _/  |_  ____   _/  |_|  |__   ____     ____  ____   __| _/____  
\   \/\/   // __ \|  | _/ ___\/  _ \ /     \_/ __ \  \   __\/  _ \  \   __\  |  \_/ __ \  _/ ___\/  _ \ / __ |/ __ \ 
 \        /\  ___/|  |_\  \__(  <_> )  Y Y  \  ___/   |  | (  <_> )  |  | |   Y  \  ___/  \  \__(  <_> ) /_/ \  ___/ 
  \__/\  /  \___  >____/\___  >____/|__|_|  /\___  >  |__|  \____/   |__| |___|  /\___  >  \___  >____/\____ |\___  >
       \/       \/          \/            \/     \/                            \/     \/       \/           \/    \/ 
----------------------------------------------------------------------------------------------------------------------*/
//var skin_sell_orders = [];
var exitFetchItems = false;
var page_index = 98;
var current_page_index = page_index;


exports.updateDb = updateDb ;
 







// https://davidwells.io/snippets/forcing-async-functions-to-sync-in-node