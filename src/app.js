const commander     = require ('commander');

const B_L           = require ('./business-logic.js') ;
const http_server   = require ('./httpserver.js');
const SkinSellOrder = require ('./skin_sell_order.js').SkinSellOrder;
const Skin          = require ('./skin.js').Skin ;
const db            = require ('./db.js');
const BitskinsFetcher    = require ('./bb_fetcher.js').BitskinsFetcher;

//====================================================================================================================
//=================================================  main de app.js  =================================================
//====================================================================================================================
console.log (appRoot);

commander
  .version('0.1.0')
  .option('-u, --update', 'Update database')
  .option('-c, --clear', 'Clear database')
  .option('-s, --server', 'Launch http server')
  .option ('-b, --backup', 'Backup database')
  .option ('-r, --restore [sql_file]', 'Restore database')
  .option ('--select [table]', 'Select all from the specified table')

commander.parse(process.argv);


if (commander.server) 
{
  var skin_map = Skin.Instances;
  var skin_values = skin_map.values();
  
  http_server.start(skin_map);
}

if (commander.update)                              BitskinsFetcher.GetSingleton().updateDb() //                             BitskinsFetcher.GetSingleton().updateDbWithAsynk();

if (commander.clear)                               db.clearTables();

if (commander.backup)                              db.backupDB();

if (commander.restore)                             db.restoreDB();

if (commander.select && commander.select != true)  db.SelectInDB(commander.select);