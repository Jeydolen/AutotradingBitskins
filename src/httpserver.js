const ejs                   = require ('ejs');
const express               = require ('express');

const { konsole, LOG_LEVEL} = rekwire('/src/bb_log.js');


const start = (skins) => 
{
    let app = express();
    let tagline = "Affronte le profit"

    // set the view engine to ejs
    app.set('view engine', 'ejs');

    // use res.render to load up an ejs view file
    // index page 
    app.get('/', function(req, res) 
    {
        res.render('index', 
        {
            "tagline" : tagline,
            "items": skins

        })
    });

    app.listen(65380);
    konsole.log('8080 is the magic port', LOG_LEVEL.MSG);
} // start

exports.start = start;