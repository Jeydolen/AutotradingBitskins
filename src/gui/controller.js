const assert                = require ('assert');

const Singleton             = rekwire ('/src/singleton.js').Singleton;
const {konsole, LOG_LEVEL}  = rekwire ('/src/bb_log.js')
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
        this.main_window = null;
        this.subscribeToEvents();
    } // constructor

    subscribeToEvents ()
    {   // Appel depuis dans le html
        // Appel depuis le menu de electron
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.POPULATE_DB_PROGRESS_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.SHOW_DEV_TOOLS_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.BACKUP_DB_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.RESTORE_DB_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.PROFIT_SLCT_SKIN_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.START_POPULATE_DB_EVT) );
        EventDispatcher.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.SUBMIT_VALUE_EVT) );
        Session.GetSingleton().subscribe        ( this, GUI.EVENT.get(GUI.APP_VAR_CHANGED_EVT) );
    } // subscribeToEvents ()


    inform ( event, args )
    {
        assert ( GUI.EVENT.isDefined( event ));

        //console.log ('controller.js inform event: ' + event.key);
        
        if (event == GUI.EVENT.get(GUI.POPULATE_DB_PROGRESS_EVT) )
        {
            //console.log ("Main_window : " + this.main_window);
            if ( this.main_window != null )
                this.main_window.webContents.send( GUI.EVENT.get(GUI.POPULATE_DB_PROGRESS_EVT).value, args );
        }
            
        else if (event == GUI.EVENT.get(GUI.SHOW_DEV_TOOLS_EVT) )
        {
            //console.log ("Main_window : " + this.main_window);
            let cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.SHOW_DEV_TOOLS_ID );
            cmd_klass.GetSingleton().execute(args); 
        }

        else if (event == GUI.EVENT.get(GUI.BACKUP_DB_EVT) )
        {
            let cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.BACKUP_DB_ID );
            cmd_klass.GetSingleton().execute(args);
        }
            
        else if (event == GUI.EVENT.get(GUI.RESTORE_DB_EVT) )
        {
            let cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.RESTORE_DB_ID );
            cmd_klass.GetSingleton().execute(args);
        }

        else if (event == GUI.EVENT.get(GUI.START_POPULATE_DB_EVT))
        {
            let cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.POPULATE_DB_ID );
            konsole.log (cmd_klass.name, LOG_LEVEL.OK)
            cmd_klass.GetSingleton().execute(null);
        }

        else if (event == GUI.EVENT.get(GUI.PROFIT_SLCT_SKIN_EVT))
        {
            //console.log ("Salut depuis controller.js")
            let cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.PROFIT_SLCT_SKIN_ID );
            cmd_klass.GetSingleton().execute(args);
        }

        else if (event == GUI.EVENT.get(GUI.SUBMIT_VALUE_EVT))
        {
            let cmd_klass =  CommandRegistry.GetSingleton().getItem( CMD_KONST.SUBMIT_VALUE_ID );
            cmd_klass.GetSingleton().execute(args);
        }

        else if (event == GUI.EVENT.get(GUI.APP_VAR_CHANGED_EVT)  )
        {
            let app_var_name = args;
            //console.log ("APPVar '" + app_var_name + "'changed");
            if ( app_var_name = Session.MainWindow )
                this.main_window = Session.GetSingleton().getAppVar(app_var_name);
        }
        else return Konst.RC.KO;
    } // inform
} // Controller
exports.Controller = Controller;