const commander = require ('commander');
const B_L = require ('./business-logic.js') ;
const updateDb = require ('./main.js').updateDb ;
const http_server = require ('./httpserver.js');

//====================================================================================================================
//=================================================  main de app.js  =================================================
//====================================================================================================================
console.log (appRoot);

const db        = require (appRoot + '/db.js');

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
  var dictionary = B_L.SkinSellOrder.GetInstances();
  var values = Object.keys(dictionary).map(function(key)
  {
    return dictionary[key];
  });

  http_server.start(values)
}

if (commander.update)                             updateDb();

if (commander.clear)                               db.clearTables();

if (commander.backup)                              db.backupDB();

if (commander.restore)                             db.restoreDB();

if (commander.select && commander.select != true)  db.SelectInDB(commander.select);