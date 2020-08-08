const MxI               = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const Enum              = require('enum');
const chalk             = require ('chalk');
const assert            = require ('assert');
const readline          = require('readline-sync');
const appRoot           = require ('app-root-path');
const { app, dialog }   = require('electron');

if (global.rekwire == undefined)
    global.rekwire = require ('app-root-path').require;

const GUI           = rekwire ('/src/gui/GUI.js').GUI;
const Singleton     = rekwire ('/src/singleton.js').Singleton;
const Session       = rekwire ('/src/session.js').Session;
const Konst         = rekwire ('/src/constants.js'); 


const LOG_LEVEL = new Enum (['OK', 'WARNING', 'MSG', 'INFO', 'PAUSE', 'ERROR', 'CRITICAL', 'STEP' ])

const COLORS = new Enum ( {'PURPLE': '#DA6DE6', 'CYAN': '#0BC6A7', 'OCHRE': '#D6BC24', 'ORANGE': '#F78A07' } );

let is_initialized = false;

//============ 'konsole' class ============
class konsole extends Singleton
{
    static Singleton = konsole.GetSingleton();

    constructor(args)
    {
        super(args);
    }

    static InitLogSinks () 
    {
        if (is_initialized) return;

        let color_logger = new ColorConsole();
        MxI.$Log.addSink(color_logger);
        
 
        //konsole.log("init_log_sinks(): data_path: " + appRoot);
        konsole.log("Sinks succefuly inintialised", LOG_LEVEL.MSG);

        Session.GetSingleton().subscribe( konsole.Singleton, GUI.EVENT.get(GUI.APP_VAR_CHANGED_EVT) );

        is_initialized = true;
    } // initLogSinks()

    static log(msg, log_level)
    {
        MxI.$Log.write(msg, log_level);
    }

    static error( msg )
    {
        konsole.log( msg, LOG_LEVEL.ERROR);
    } // error()

    static msg( msg )
    {
        konsole.log( msg, LOG_LEVEL.MSG);
    } // msg()

    static warn( msg )
    {
        konsole.log( msg, LOG_LEVEL.WARNING);
    } // warn()

    inform ( event, args )
    {
        assert ( GUI.EVENT.isDefined( event ));

        //console.log ('controller.js inform event: ' + event);
        if (event == GUI.EVENT.get(GUI.APP_VAR_CHANGED_EVT).key)
        {
            let app_var_name = args;
            console.log ("APPVar '" + app_var_name + "'changed");
            if ( app_var_name = Session.Broker )
            {
                let broker_value = args;
                let moleculer_logger = new MoleculerConsole( broker_value );
                MxI.$Log.addSink(moleculer_logger);
            }
        }

        else return Konst.RC.KO;
    } // inform
} // konsole class
//============ 'konsole' class ============


//============ 'ColorConsole' implementation class ============
class ColorConsole extends MxI.$Implementation(MxI.$ConsoleLogSink).$with(MxI.$ILogSink) 
{
    
    constructor(args) 
    {
        super();
        this._$prefix = "-> ";
    } // 'ColorConsole' constructor
    
    
    // Fallback implementation of 'ColorConsole' service
    log( arg_msg, log_level )
    {

        if      (log_level == LOG_LEVEL.OK ) console.log(chalk.green(arg_msg));

        else if (log_level == LOG_LEVEL.MSG )
        {
            console.log(chalk.hex(COLORS.PURPLE.value)(arg_msg));
        }

        else if (log_level == LOG_LEVEL.INFO )
            console.log(chalk.hex(COLORS.CYAN.value)(arg_msg));


        else if (log_level == LOG_LEVEL.STEP )
        {
            if ( process.type == undefined)
            {
                console.log(chalk.hex(COLORS.CYAN.value)(arg_msg));
                if (readline.keyInYN("Do you want to stop ?")) 
                    process.exit(0);
            }     
            else if (process.type == "browser")
            {
                const options = 
                {
                    buttons: ['Yes', 'No'],
                    defaultId: 0,
                    type : "question",
                    //title: 'Warning Step',
                    message: 'Do you want to stop ?'
                };

                let response = dialog.showMessageBoxSync(options)
                
                    console.log (response);
                    if (response == 0)
                        app.exit(0);
            }
        }     

        else if (log_level == LOG_LEVEL.PAUSE)
            console.log(chalk.hex(COLORS.OCHRE.value)(arg_msg));

        else if (log_level == LOG_LEVEL.WARNING )
            console.log(chalk.hex(COLORS.ORANGE.value)( "!!! " + arg_msg));

        else if (log_level == LOG_LEVEL.ERROR )
            console.log(chalk.hex('#D8D8D8').bgHex('#8A0808')( "*** " + arg_msg + " ***"));

        else if (log_level == LOG_LEVEL.CRITICAL )
        {
            let critical_msg = "  F* word  [ " + arg_msg + " ] F* word  ";

            let repeat_symbol_count = 100;

            console.log( chalk.white.bold.bgHex('#FF00FF')("=".repeat(repeat_symbol_count)) );
            console.log( chalk.white.bold.bgHex('#FF00FF')(critical_msg));
            console.log( chalk.white.bold.bgHex('#FF00FF')("=".repeat(repeat_symbol_count)));
            //assert(false);
            process.exit(Konst.RC.KO);
        }
        
        else 
            console.log(chalk.white(arg_msg));
            
    } // $ILogSink.log()
} // 'ColorConsole' class
  MxI.$setClass(ColorConsole).$asImplementationOf(MxI.$ILogSink);
//============ 'ColorConsole' implementation class ============


//============ 'FileLogger' implementation class ============
class FileLogger extends MxI.$Implementation(MxI.$FileLogSink).$with(MxI.$ILogSink) 
{
    
    constructor(args) 
    {
        super(args);
        // this._$prefix = "-> ";
    } // 'FileLogger' constructor
    
    
    // Fallback implementation of 'FileLogger' service
    log(arg_msg, log_level)
    {
        arg_msg = "### " + arg_msg;
        if (log_level == LOG_LEVEL.ERROR )    
            this._log2file(arg_msg);
            
        else if (log_level == LOG_LEVEL.WARNING )
            this._log2file( "!!! " + arg_msg);

    } // $ILogSink.log()
} // 'FileLogger' class
MxI.$setClass(FileLogger).$asImplementationOf(MxI.$ILogSink);
//============ 'FileLogger' implementation class ============


//============ 'MoleculerConsole' implementation class ============
class MoleculerConsole extends MxI.$Implementation(MxI.$ConsoleLogSink).$with(MxI.$ILogSink) 
{
    constructor(args) 
    {
        super(args);
        this.broker = args;
    } // 'MoleculerConsole' constructor
    
    
    // Fallback implementation of 'MoleculerConsole' service

    log(arg_msg, log_level)
    {
        arg_msg = "### " + arg_msg;
        if ( this.broker != null )
            this.broker.logger.log("Log message via Broker logger");
        console.log("Salut toi aussi");
    } // $ILogSink.log()
} // 'MoleculerConsole' class
  MxI.$setClass(MoleculerConsole).$asImplementationOf(MxI.$ILogSink);
//============ 'MoleculerConsole' implementation class ============


  exports.ColorConsole = ColorConsole;
  exports.FileLogger = FileLogger;
  exports.MoleculerConsole = MoleculerConsole;
  exports.konsole = konsole;
  exports.LOG_LEVEL = LOG_LEVEL ;
