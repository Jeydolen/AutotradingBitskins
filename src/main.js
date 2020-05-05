const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const commander = require('commander');
const async_npm = require ('async');


const http_server = require ('./httpserver.js');
const db = require ('./db.js');
const rdp = require('./rechercheduprofit.js');
const B_L = require ('./business-logic.js');
const sql_u = require ('./sql_utilities')
const ColorConsole     = require ('./ColorConsole.js');


const ERROR_NO_DATA = "NO_DATA";

var jsonData = ERROR_NO_DATA;
var jsonObj = ERROR_NO_DATA;



const saveSkinSellOrders = function (json_obj)
{
    var read_items = json_obj['data']['items'];
    // console.log("read_items: " + read_items.length);
    

    
    for (var i = 0, len = read_items.length; i < len; i++) 
    {
        var skin            = B_L.Skin.Create (db.getDBConnection(), read_items[i]) ;    
        var skin_set        = B_L.SkinSet.Create (db.getDBConnection(), read_items[i]) ; 
        var skin_sell_order = B_L.SkinSellOrder.Create (db.getDBConnection(), read_items[i]);
        // skin_sell_orders.push(skin_sell_order);

        skin.storeInDB();

        if (skin_set != B_L.SkinSet.NULL_SKINSET)
          skin_set.storeInDB();

        skin_sell_order.storeInDB ();
    }
    // console.log ("Number of skins saved : " + B_L.SkinSellOrder.GetInstances().length);

};

const parseOnResponseReady = function(json_data)
{
   //-------------------- Parsing des données --------------------
   jsonData = json_data;
   jsonObj = ERROR_NO_DATA;
   try 
   {
        var items_count = 0;
        // console.log("Try Parsing");
        jsonObj = JSON.parse(json_data.toString());

        if (   jsonObj['data'] != undefined  
           && jsonObj['data']['items'] != undefined
           && jsonObj['data']['items'].length > 0
          )
        {
            items_count = jsonObj['data']['items'].length;
            MxI.$Log.write('firstItem : ' + jsonObj['data']['items'][0].market_hash_name, ColorConsole.LOG_LEVEL.MSG);
            MxI.$Log.write("page :" +jsonObj['data']['page'], ColorConsole.LOG_LEVEL.MSG)
            saveSkinSellOrders(jsonObj);  
        };

        // console.log("items_count : "+ items_count);
        exitFetchItems = (items_count == 0);
    }
   catch(errorCode) {
       MxI.$Log.write("Main.parseOnResponseReady () : Error when Parsing", ColorConsole.LOG_LEVEL.ERROR);
       console.log("error code: " + errorCode); // error in the above string (in this case, yes)!
   } 
   //-------------------- Parsing des données 
   return jsonObj;
} // parseOnResponseReady()

const checkPageReady = function() 
{
    //console.log("après pause de 6 sec");
    return (page_index > current_page_index);
}; // checkPageReady()



const updateDb = () => 
{
    db.clearDb();
  
    async_npm.until( 
      function test(cb) 
      {
        // console.log("exitFetchItems: " + exitFetchItems);
        cb(null, exitFetchItems); 
      },
  
      function iter(cb) 
      {
        //ItemsCount = 0;
        MxI.$Log.write("Traitementde la page : " + page_index, ColorConsole.LOG_LEVEL.MSG);
        rdp.fetchItems(page_index, parseOnResponseReady);
        // console.log("avant pause de 6 sec");
        var page_ready = setTimeout(cb, 6000); 
        page_index++;
      },
  
      // End
      function (err) 
      {
        // All things are done!
        MxI.$Log.write("Main.updateDB() : Fin de traitement des pages.", ColorConsole.LOG_LEVEL.MSG);
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
var ItemsCount = 480;
var items_count = 1;
var page_index = 98;
var current_page_index = page_index;



 
commander
  .version('0.1.0')
  .option('-u, --update', 'Update database')
  .option('-c, --clear', 'Clear database')
  .option('-s, --server', 'Launch http server')
  .option ('-b, --backup', 'Backup database')
  .option ('-r, --restore [sql_file]', 'Restore database')
  .option ('-x, --select ', 'Select fields in table')
  .command ('select [table]')
  .action ((table) => 
  {
    db.SelectInDB(table)
  });



commander.parse(process.argv);


if (commander.server) 
{
  var dictionary = B_L.SkinSellOrder.GetInstances();
  var values = Object.keys(dictionary).map(function(key)
  {
    return dictionary[key];
  });

  http_server.start(values)
}
if (commander.update)    updateDb();

if (commander.clear)   db.clearDb();

if (commander.backup)  db.backupDB();

if (commander.restore) db.restoreDB();






// https://davidwells.io/snippets/forcing-async-functions-to-sync-in-node