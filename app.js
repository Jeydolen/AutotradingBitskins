const commander     = require ('commander');
const { app, BrowserWindow, Menu, dialog, ipcMain } = require( 'electron' );
//const electron_debug = require('electron-debug');

// https://github.com/inxilpro/node-app-root-path 
global.rekwire = require('app-root-path').require;

const http_server     = rekwire ('/src/httpserver.js');
const db              = rekwire ('/src/db.js');
const BitskinsFetcher = rekwire ('/src/bb_fetcher.js').BitskinsFetcher;
const Controller      = rekwire ('/src/gui/controller.js').Controller;

const MENU_LABELS = 
{
  'file-id':    'Fichier',
  'run-id' :    'Lancer',
  'quit-id':    'Quitter'
}; // MENU_LABELS

var main_window;



//====================================================================================================================
//=================================================  main de app.js  =================================================
//====================================================================================================================


const ParseCommandLineArgs = (args) =>
{

  commander
  .version('0.1.0')
  .option ('-u, --update', 'Update database')
  .option ('-c, --clear', 'Clear database')
  .option ('-s, --server', 'Launch http server')
  .option ('-b, --backup', 'Backup database')
  .option ('-r, --restore [sql_file]', 'Restore database')
  .option ('-a, --admin', 'Access to electron admin dashboard')
  .option ('--select [table]', 'Select all from the specified table')
  


  commander.parse(process.argv);
  console.log (process.argv)


  if (commander.server) 
  {
    var skin_map = Skin.Instances;
    var skin_values = skin_map.values();
    
    http_server.start(skin_map);
  }
  
  if (commander.update)                              BitskinsFetcher.GetSingleton().updateDb()
  
  if (commander.admin)
  {
    //console.log ("Bienvenue");
    //electron_debug();
    app.whenReady().then( createWindow ).then( createMenu );
  }
  
  if (commander.clear)                               db.clearTables();
  
  if (commander.backup)                              db.backupDB();
  
  if (commander.restore)                             db.restoreDB();
  
  if (commander.select && commander.select != true)  db.SelectInDB(commander.select);
  
};


const createWindow = () => 
{
  // Create the browser window.
  main_window = new BrowserWindow
  ({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: true }
  })
  main_window.loadFile( './src/gui/index.html' );

  Controller.GetSingleton( main_window );
  //console.log ("Bienvenue dans l'appel de  GetSingleton  de controller.js (app.js)");
}; // createWindow()


const createMenu = () =>
{
    var menu = Menu.buildFromTemplate
    ([
        {
            label: MENU_LABELS['file-id'],
            submenu: 
            [   {   label: MENU_LABELS['run-id'],
                    click() 
                    {
                      BitskinsFetcher.GetSingleton().updateDb();
                    }
                    
                },
                {   type: 'separator' },
                {
                    label: MENU_LABELS['quit-id'], 
                    click() { app.quit(); } 
                }
            ],
        }
    ]);
    Menu.setApplicationMenu( menu ); 
}; // createMenu();

//app.whenReady().then( createWindow ).then( createMenu );


ParseCommandLineArgs()