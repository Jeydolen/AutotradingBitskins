const commander     = require ('commander');
const fetch         = require ('node-fetch');
const { app, BrowserWindow, Menu, dialog, ipcMain, session } = require( 'electron' );
const { EventDispatcher } = require('./src/event_dispatcher');
const APP_ROOT_PATH            = require ('app-root-path');
const { konsole } = require('./src/bb_log');
const { Session } = require('./src/session');

// https://github.com/inxilpro/node-app-root-path 
// Permet d'enregistrer au niveau de global rekwire (pck ipcMain)
global.rekwire = require('app-root-path').require;
if      ( !global[rekwire] )       global[rekwire] = rekwire;

const StellaServiceBroker = rekwire ('/src/microservices/stella/stella_service_broker.js').StellaServiceBroker;
const http_server         = rekwire ('/src/httpserver.js');
const db                  = rekwire ('/src/db.js');
const Controller          = rekwire ('/src/gui/controller.js').Controller;
const GUI                 = rekwire ('/src/gui/GUI.js').GUI;
const Boostrap            = rekwire ('/src/boostrap.js').Boostrap;
const CommandRegistry     = rekwire ('/src/commands/command_registry.js').CommandRegistry;
const ShowDevToolsCmd     = rekwire ('/src/commands/show_dev_tools_cmd.js').ShowDevToolsCmd;
const CMD_KONST           = rekwire ('/src/commands/command_constants.js').CMD_KONST;


const MENU_LABELS = 
{
  'file-id'           :    'Fichier',
  'run-id'            :    'Lancer',
  'backup-id'         :    'Backup DB',
  'backup-as-id'      :    'Backup DB as...',
  'restore-id'        :    'Restore DB from...',
  'quit-id'           :    'Quitter'
}; // MENU_LABELS

var main_window = null;

//====================================================================================================================
//=================================================  main de app.js  =================================================
//====================================================================================================================


const ParseCommandLineArgs = (args) =>
{

  commander
  .version('0.1.0')
  .option ('-u, --update', 'Update database')
  .option ('-c, --clear', 'Clear database')
  .option ('-h, --http', 'Launch http server')
  .option ("-m, --moleculer", "Launch Moleculer API Gateway (port 51374)")
  .option ('-b, --backup', 'Backup database')
  .option ('-r, --restore [sql_file]', 'Restore database')
  .option ('-a, --admin', 'Access to electron admin dashboard')
  .option ('--select [table]', 'Select all from the specified table')
  


  commander.parse(process.argv);
  console.log (process.argv)


  if (commander.http) 
  {
    var skin_map = Skin.Instances;
    var skin_values = skin_map.values();
    
    http_server.start(skin_map);
  }

  if (commander.moleculer) 
  {
    BB_ServiceBroker.GetSingleton().start();
  }

  if (commander.update)                              
  {
    var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.POPULATE_DB_ID );
    cmd_klass.GetSingleton().execute(null);
  }

  if (commander.admin)
  {
    StellaServiceBroker.GetSingleton().start();
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
    webPreferences: { nodeIntegration: true, enableRemoteModule: true }
  })
  main_window.loadFile( './src/gui/index.html' );
  main_window.webContents.openDevTools();

  Session.GetSingleton().setAppVar( Session.MainWindow, main_window );
  
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
                      fetch('http://localhost:51374/stella/db/populate')
                      .then ( (res) => 0 )
                    }
                },
                {   label: MENU_LABELS['backup-id'],
                    click() 
                    {
                      var event = GUI.EVENT.get(GUI.BACKUP_DB_EVT);
                      EventDispatcher.GetSingleton().dispatch(event, null);
                    }
                    
                },
                {   label: MENU_LABELS['backup-as-id'],
                  click() 
                  {
                    dialog.showSaveDialog
                    ( main_window, 
                      {   properties: ['saveFile'],
                          title:  MENU_LABELS['backup-as-id'],
                          defaultPath : APP_ROOT_PATH + '\\data\\sql',
                          filters: [ { name: 'SQL Files', extensions: ['sql'] } ]
                      }
                    ).then
                    ( result => 
                      {
                        if ( result.canceled ) return;
                        //console.log (JSON.stringify(result));
                        if ( result.filePath != undefined )
                        {
                          var output_sql_file_path = result.filePath;
                          var event = GUI.EVENT.get(GUI.BACKUP_DB_EVT);
                          EventDispatcher.GetSingleton().dispatch(event, output_sql_file_path);

                        } // if 
                      }
                    ).catch( err => { console.log( err) });   
                  }
                
                },
                {   label: MENU_LABELS['restore-id'],
                  click() 
                  {
                    dialog.showOpenDialog
                    ( main_window, 
                      {   properties: ['openFile'],
                          title:  MENU_LABELS['restore-id'],
                          defaultPath : APP_ROOT_PATH + '\\data\\sql',
                          filters: [ { name: 'SQL Files', extensions: ['sql'] } ]
                      }
                    ).then
                    ( result => 
                      {
                        if ( result.canceled ) return;
                        if ( result.filePaths.length == 1 )
                        {
                          var input_sql_file_path = result.filePaths[0];
                          var event = GUI.EVENT.get(GUI.RESTORE_DB_EVT);
                          EventDispatcher.GetSingleton().dispatch(event, input_sql_file_path);
                        } // if 
                      }
                    )     
                  }
                
                },
                {   type: 'separator' },
                {  label: MENU_LABELS['quit-id'], 
                    click() { app.quit(); } 
                }
            ],
        }
    ]);
    Menu.setApplicationMenu( menu ); 
}; // createMenu();

konsole.InitLogSinks();
Boostrap.GetSingleton().init();
Controller.GetSingleton( null );
ParseCommandLineArgs()
