const commander = require('commander');
const async_npm = require ('async');


const httpserver = require ('./httpserver.js')
const db = require ('./db.js');
const rdp = require('./rechercheduprofit.js');
const ERROR_NO_DATA = "NO_DATA";


var jsonData = ERROR_NO_DATA;
var jsonObj = ERROR_NO_DATA;


class SkinSellOrder {
    constructor(input_item) {
        this.sell_order_id_str = input_item.item_id;
        this.market_hash_name = input_item.market_hash_name;
        this.item_rarity = input_item.item_rarity;
        this.state = this.computeState (input_item.float_value);
        this.image = input_item.image;
        this.price = input_item.price;
        this.suggested_price = input_item.suggested_price;
    }

    computeState (value) 
    {
      
      var state = 0;
      if ( value >= 0.45  &&  value < 1.00 )
      {
        state = 1
      }
      else if ( value >= 0.38  &&  value < 0.45 )
      {
        state = 2
      }
      else if ( value >= 0.15  &&  value < 0.38 )
      {
        state = 3
      }
      else if ( value >= 0.07  &&  value < 0.15 )
      {
        state = 4
      }
      else if ( value >= 0  &&  value < 0.07 )
      {
        state = 5
      }
      return state;
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
  .command('update', 'Update database', updateDb)
  .command('clear', 'Clear database', clearDb)
  .command('server', 'Launch http server', httpserver.start)
  .parse(process.argv);









// https://davidwells.io/snippets/forcing-async-functions-to-sync-in-node