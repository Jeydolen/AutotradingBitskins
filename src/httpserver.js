const ejs = require ('ejs');
const express = require ('express')
const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 

const ColorConsole = require ('./ColorConsole.js');


const start = (skin_sell_orders) => {
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
        "items": skin_sell_orders

    })
});
app.listen(8080);
MxI.$Log.write('8080 is the magic port', ColorConsole.LOG_LEVEL.MSG);
}


exports.start = start;