
const commander = require('commander');
const async_npm = require ('async');

const http_server = require ('./httpserver.js')
const db = require ('./db.js');
const rdp = require('./rechercheduprofit.js');
const ERROR_NO_DATA = "NO_DATA";

var jsonData = ERROR_NO_DATA;
var jsonObj = ERROR_NO_DATA;

class SkinSellOrder { // 1) Valeur db 2) Valeur JSON
    constructor(input_item) 
    {
        this.id_str = input_item.item_id;
        this.market_name = input_item.market_hash_name;
        this.item_rarity = this.computeRarityID(input_item.item_rarity);
        this.state = this.computeStateID (input_item.float_value);
      //  this.image_url = input_item.image;
        this.price = input_item.price;
        this.recommanded_price = input_item.suggested_price;
    }

    computeStateID (value) 
    {
      var id = 0;
      if      ( value >= 0.45  &&  value < 1.00 )
        id = 1
      else if ( value >= 0.38  &&  value < 0.45 )
        id = 2
      else if ( value >= 0.15  &&  value < 0.38 )
        id = 3
      else if ( value >= 0.07  &&  value < 0.15 )
        id = 4
      else if ( value >= 0  &&  value < 0.07 )
        id = 5
      return id;
    }

    computeRarityID (value)
    {
      var id = 0;
      if      ( value == 'Consumer Grade' )
        id = 1
      else if ( value == 'Industrial Grade' )
        id = 2
      else if ( value == 'Mil-Spec Grade' )
        id = 3
      else if ( value == 'Restricted' )
        id = 4
      else if ( value == 'Classified' )
        id = 5
      else if ( value == 'Covert' )
        id = 6
      else if ( value == 'Contraband' )
        id = 7
      return id;
    }
} // SkinSellOrder class 

class Skin 
{
  constructor(input_item) 
    {
        this.id_str = input_item.item_id;
        this.market_name = input_item.market_hash_name;
        this.item_rarity = this.computeRarityID(input_item.item_rarity);
        this.state = this.computeStateID (input_item.float_value);
      //  this.image_url = input_item.image;
        this.price = input_item.price;
        this.recommanded_price = input_item.suggested_price;
    }
}



const saveSkinSellOrders = function (json_obj)
{
    var read_items = json_obj['data']['items'];
    console.log("read_items: " + read_items.length);
    

    
    for (var i = 0, len = read_items.length; i < len; i++) 
    {
        var skin_sell_order = new SkinSellOrder(read_items[i]);
        skin_sell_orders.push(skin_sell_order);
        db.storeSkinSellOrder (skin_sell_order);
    }
    console.log ("Number of skins saved : " + skin_sell_orders.length);

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
            console.log('firstItem : ' + jsonObj['data']['items'][0].market_hash_name);
            console.log ("page :" +jsonObj['data']['page'])
            saveSkinSellOrders(jsonObj);  
        };

        console.log("items_count : "+ items_count);
        exitFetchItems = (items_count == 0);
    }
   catch(e) {
       console.log("Error when Parsing");
       console.log(e); // error in the above string (in this case, yes)!
   } 
   //-------------------- Parsing des données 
   return jsonObj;
} // parseOnResponseReady()

const checkPageReady = function() 
{
    //console.log("après pause de 6 sec");
    return (page_index > current_page_index);
}; // checkPageReady()
const clearDb = () =>
{
  db.connect();
  db.clearTables ();
};



const updateDb = () => 
{
    clearDb();
  
    async_npm.until( 
    
    function test(cb) 
    {
      console.log("exitFetchItems: " + exitFetchItems);
      cb(null, exitFetchItems); 
    },
  
    function iter(cb) 
    {
      //ItemsCount = 0;
      console.log("Traitement récurrent page_index: " + page_index);
      rdp.fetchItems(page_index, parseOnResponseReady);
      // console.log("avant pause de 6 sec");
      var page_ready = setTimeout(cb, 6000); 
      page_index++;
    },
  
    // End
    function (err) 
    {
      // All things are done!
      console.log(".");
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
var skin_sell_orders = [];
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
  .option ('-r, --restore [sql_file]', 'Restore database');

commander.parse(process.argv);

if (commander.server) 
{
  http_server.start(skin_sell_orders)
}
if (commander.update) 
{
  updateDb();
}
if (commander.clear) 
{
  clearDb();
}
if (commander.backup)
{
  db.backupDB();
}
if (commander.restore)
db.restoreDB()





// https://davidwells.io/snippets/forcing-async-functions-to-sync-in-node