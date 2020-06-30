const Konst                 = rekwire ('/src/constants.js');
const { konsole, LOG_LEVEL} = rekwire ('/src/bb_log.js');
const Command               = rekwire ('/src/commands/command.js').Command;


class ShowDevToolsCmd extends Command
{
    static MainWindow = null;

    constructor( name ) 
    {
        super (name); 
        this.name = name;
    }

    static SetMainWindow( main_window)
    {
        if (main_window != null && main_window != undefined )
            ShowDevToolsCmd.MainWindow = main_window;
    }
    
    execute ( args )
    {
        if (ShowDevToolsCmd.MainWindow != null && ShowDevToolsCmd.MainWindow != undefined )
            ShowDevToolsCmd.MainWindow.webContents.openDevTools();
    } // execute()
} // ShowDevToolsCmd class 
exports.ShowDevToolsCmd = ShowDevToolsCmd;