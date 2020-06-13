const commander     = require ('commander');


// https://github.com/inxilpro/node-app-root-path 
global.rekwire = require('app-root-path').require;

const http_server     = rekwire ('/src/httpserver.js');
const db              = rekwire ('/src/db.js');
const BitskinsFetcher = rekwire ('/src/bb_fetcher.js').BitskinsFetcher;

//====================================================================================================================
//=================================================  main de app.js  =================================================
//====================================================================================================================
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