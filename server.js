const rdp = require('./rechercheduprofit.js');
const ejs = require ('ejs');
const express = require ('express')
const fs = require('fs'); 
const mysql = require('mysql');


class ExtracedItem {
    constructor(input_item) {
        this.item_id = input_item.item_id;
        console.log("item_id: " + this.item_id)
        this.market_hash_name = input_item.market_hash_name;
        this.item_rarity = input_item.item_rarity;
        this.float_value = input_item.float_value;
        this.image = input_item.image;
        this.price = input_item.price;
        this.suggested_price = input_item.suggested_price;
    }
}


var items_count = 1;
var page_index = 0;

// rdp.deleteResponseFile(0);

while (items_count > 0 )
{
    //-------------------- 1. Récupération des Données --------------------
    // https://javascript.info/task/async-from-regular
    page_index += 1;
    console.log('page : ' +page_index);

    var jsonData = "nodata1";

    //========== fetchItems ==========
    rdp.fetchItems(page_index);

    var responseReady = false;
    while (! responseReady)
    {
        responseReady = fs.existsSync(rdp.buildFileName(page_index));
        // process.stdout.write(".");
    }
    jsonData = fs.readFileSync (rdp.buildFileName(page_index), 'utf8');
   //---------------------------------------------------------------------

   //-------------------- 2. Parsing des données --------------------
    var jsonObj = "nodata2";
    try 
    {
        jsonObj = JSON.parse(jsonData.toString());
    }    
    catch(e) {
        console.log(e); // error in the above string (in this case, yes)!
    } 
    //-------------------- 2. Parsing des données 

    //fs.unlinkFileSync (rdp.buildFileName(page_index), 'utf8');
    rdp.deleteResponseFile(page_index);

    console.log(jsonObj['data']['page']);
    console.log("jsonData size:" + jsonData.length);

    items_count = jsonObj['data']['items'].length;
    console.log("items count :" +items_count);
    console.log('firstItem : ' + jsonObj['data']['items'][0].market_hash_name);
    //---------------------------------------------------------------------
}; // while (items_count > 0 )

return 0;

//-------------------- 3. Extraction des items --------------------
var read_items = jsonObj['data']['items'];
console.log("read_items: " + read_items.length);

var extracted_items = [];

for (var i = 0, len = read_items.length; i < len; i++) {
    var new_extracted_item = new ExtracedItem(read_items[i]);
    extracted_items.push(new_extracted_item);
}
console.log("extracted_items:" + extracted_items.length);

//---------------------------------------------------------------------


//-------------------- 4. Connection DB --------------------

 var con = mysql.createConnection({
    host: "localhost",
    port: "3308",
    user: "rdp_admin",
    password: "UZ14xdQ7E",
    database: 'bitskins_csgo'

  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

//---------------------------------------------------------------------

//-------------------- 5. Serveur Http --------------------
var app = express();
var tagline = "Affronte le profit"
// set the view engine to ejs
app.set('view engine', 'ejs');
// use res.render to load up an ejs view file
// index page  
app.get('/', function(req, res) {
    res.render('index', 
    {
        "tagline" : tagline,
        "items": extracted_items

    })
});
app.listen(8080);
console.log('8080 is the magic port');

//----------------------------------------------------------



// https://davidwells.io/snippets/forcing-async-functions-to-sync-in-node