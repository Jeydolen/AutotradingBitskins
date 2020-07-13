const assert = require ('assert')

const Konst                 = rekwire ('/src/constants.js');
const { konsole, LOG_LEVEL} = rekwire ('/src/bb_log.js');
const Command               = rekwire ('/src/commands/command.js').Command;
const Session               = rekwire ('/src/session.js').Session;
const GUI                   = rekwire ('/src/gui/GUI.js').GUI;

class ShowDevToolsCmd extends Command
{
    static Singleton = this.GetSingleton();
    constructor( name ) 
    {
        super (name); 
        this.name = name;
        this.main_window = null;
        konsole.log ("CONSTRUCTOR RRRRRRRRRRRRRR", LOG_LEVEL.ERROR)
        Session.GetSingleton().subscribe( this, GUI.EVENT.get(GUI.APP_VAR_CHANGED_EVT) );
    } // constructor


    inform ( event, name_arg )
    {
        assert ( GUI.EVENT.isDefined( event ));

        konsole.log ("YOOOOO222O", LOG_LEVEL.ERROR)
        if (event == GUI.EVENT.get(GUI.APP_VAR_CHANGED_EVT))
        {
            var app_var_name = name_arg;
            konsole.log ("APPVar '" + app_var_name + "'changed", LOG_LEVEL.MSG);
            if ( app_var_name = Session.MainWindow )
            {
                this.main_window = Session.GetSingleton().getAppVar(app_var_name);
            }
        }

        else return Konst.RC.KO;
    } // inform
  
    
    execute ( args )
    {
        konsole.log ("YOOOOOO + this.main_window" + this.main_window, LOG_LEVEL.ERROR)
        if ( this.main_window != null && this.main_window != undefined )
            this.main_window.webContents.toggleDevTools();
    } // execute()
} // ShowDevToolsCmd class 
exports.ShowDevToolsCmd = ShowDevToolsCmd;