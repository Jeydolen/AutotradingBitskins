const assert                = require ('assert');
const { ipcMain }           = require( 'electron' );


const BitskinsFetcher       = rekwire ( '/src/bb_fetcher.js').BitskinsFetcher;
const Singleton             = rekwire ('/src/singleton.js').Singleton;
const Konst                 = rekwire ('/src/constants.js');
const EventDispatcher       = rekwire ('/src/event_dispatcher.js').EventDispatcher;
const GUI                   = rekwire ('/src/gui/GUI.js').GUI;
const Session               = rekwire ('/src/session.js').Session;
const CommandRegistry       = rekwire ('/src/commands/command_registry.js').CommandRegistry;
const CMD_KONST             = rekwire ('/src/commands/command_constants.js').CMD_KONST;


class Controller extends Singleton
{
    static Singleton = null;

    constructor (args )
    {
        super (args)
        //console.log ("Bienvenue dans controller.js");
        this.main_window = null;
        this.subscribeToEvents();
    } // constructor

    subscribeToEvents ()
    {   // Appel depuis dans le html

        if (ipcMain != undefined)
        {  
            ipcMain.on( GUI.EVENT.get(GUI.START_POPULATE_DB_EVT).value, function (event, arg) 
            {
                //console.log ('Test controller.js')
                var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.POPULATE_DB_ID );
                console.log ('controller.js cmd_klass' + cmd_klass.name);
                cmd_klass.GetSingleton().execute(null);
            });

            ipcMain.on( GUI.EVENT.get(GUI.PROFIT_SLCT_SKIN_EVT).value, function (event, arg) 
            {
                //console.log ('Test controller.js')
                var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.PROFIT_SLCT_SKIN_ID );
                console.log ('controller.js cmd_klass' + cmd_klass.name);
                cmd_klass.GetSingleton().execute(arg);
            });

            ipcMain.on( GUI.EVENT.get(GUI.SHOW_DEV_TOOLS_EVT).value, function (event, arg) 
            {
                var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.SHOW_DEV_TOOLS_ID );
                console.log ('controller.js cmd_klass' + cmd_klass.name);
                cmd_klass.GetSingleton().execute(arg);
            });
        }
        // Appel depuis le menu de electron
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.POPULATE_DB_PROGRESS_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.BACKUP_DB_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.RESTORE_DB_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.START_POPULATE_DB_EVT) );

        Session.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.APP_VAR_CHANGED_EVT) );
    } // subscribeToEvents ()


    inform ( event, args )
    {
        assert ( GUI.EVENT.isDefined( event ));

        //console.log ('controller.js inform event: ' + event);
        
        if (event == GUI.EVENT.get(GUI.POPULATE_DB_PROGRESS_EVT).key )
        {
            if ( this.main_window != null )
                this.main_window.webContents.send( GUI.EVENT.get(GUI.POPULATE_DB_PROGRESS_EVT).value, args );
        }
            

        else if (event == GUI.EVENT.get(GUI.BACKUP_DB_EVT).key )
        {
            var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.BACKUP_DB_ID );
            cmd_klass.GetSingleton().execute(args);
        }
            
        else if (event == GUI.EVENT.get(GUI.RESTORE_DB_EVT).key )
        {
            var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.RESTORE_DB_ID );
            cmd_klass.GetSingleton().execute(args);
        }

        else if (event == GUI.EVENT.get(GUI.START_POPULATE_DB_EVT).key)
        {
            var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.POPULATE_DB_ID );
            cmd_klass.GetSingleton().execute(null);
        }

        else if (event == GUI.EVENT.get(GUI.PROFIT_SLCT_SKIN_EVT).key)
        {
            console.log ("Salut depuis controller.js")
            var cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.PROFIT_SLCT_SKIN_ID );
            cmd_klass.GetSingleton().execute(null);
        }

        else if (event == GUI.EVENT.get(GUI.APP_VAR_CHANGED_EVT).key)
        {
            var app_var_name = args;
            console.log ("APPVar '" + app_var_name + "'changed");
            if ( app_var_name = Session.MainWindow )
                this.main_window = Session.GetSingleton().getAppVar(app_var_name);
        }

        else return Konst.RC.KO;
    } // inform
} // Controller
exports.Controller = Controller;