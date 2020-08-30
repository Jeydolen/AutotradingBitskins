const { app, BrowserWindow } = require( 'electron' );
//const { Session } = require ('..')



let main_window = null;

const createWindow = () => 
{
  // Create the browser window.
  main_window = new BrowserWindow
  ({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: true, enableRemoteModule: true },
    title: 'Phobos',

  })
  main_window.loadFile( './src/index.html' );
  main_window.removeMenu();
  //main_window.webContents.openDevTools();

  //Session.GetSingleton().setAppVar( Session.MainWindow, main_window );

  
}; // createWindow()


app.whenReady().then( createWindow );//.then( createMenu );