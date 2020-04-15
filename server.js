const rdp = require('./rechercheduprofit.js');
const ejs = require ('ejs');
const express = require ('express')
const fs = require('fs'); 
const mysql = require('mysql');


class ExtracedItem {
    constructor(input_item) {
        this.item_id = input_item['item_id'];
        console.log("item_id: " + this.item_id)
        this.market_hash_name = input_item.market_hash_name;
        this.item_rarity = input_item.item_rarity;
        this.float_value = input_item.float_value;
    }
}



//-------------------- 1. Récupération des Données --------------------
// https://javascript.info/task/async-from-regular
var jsonData = "nodata1";
rdp.myBackEndLogic();

var responseReady = false;
while (! responseReady)
{
   responseReady = fs.existsSync('response.json');
   process.stdout.write(".");
}
jsonData = fs.readFileSync ('response.json', 'utf8');
//---------------------------------------------------------------------

//-------------------- 2. Parsing des données --------------------
var jsonObj = "nodata2";
try {
    jsonObj = JSON.parse(jsonData.toString());
} catch(e) {
    console.log(e); // error in the above string (in this case, yes)!
} 
console.log(jsonObj);
console.log("jsonData size:" + jsonData.length);
//---------------------------------------------------------------------

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
// return 0;
//-------------------- 4. Connection DB --------------------
 /* 
 
 
 
 
 
 var con = mysql.createConnection({
    host: "localhost",
    user: "RDP",
    password: "HOjpg@Moeo0Siy5Oatp^1ptnq6pipVfbxh^9WJraDSPgR8QaoL5EZ21QeCYFk0D8TP8^gpPK2lIPvx0P$LkL*Lr7ZL11T8$VDiI"

  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });





  */
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