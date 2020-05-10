const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const Enum = require('enum');
const chalk = require ('chalk');
const timestamp = require ('time-stamp');
const path = require('path');
const assert = require("assert");

const Konst   = require ('./constants.js'); 

global.appRoot = path.resolve(__dirname);

const LOG_LEVEL = new Enum (['OK', 'WARNING', 'MSG', 'INFO','ERROR', 'CRITICAL' ])

var is_initialized = false;

const init_log_sinks = () =>
{
    if (is_initialized) return;

    var color_logger = new ColorConsole();
    MxI.$Log.addSink(color_logger);
    
    var data_path = appRoot + "/../data/log/";
    konsole.log("init_log_sinks(): data_path: " + data_path);
    var file_logger = new FileLogger( data_path + "/log_"+ timestamp('YYYY_MM_DD_HH_mm') + '.txt');
    MxI.$Log.addSink(file_logger);
    konsole.log("Sinks succefuly inintialised", LOG_LEVEL.MSG);

    is_initialized = true;
} // init_log_sinks()

class konsole
{
    static log(msg, log_level)
    {
        MxI.$Log.write(msg, log_level);
    }
} // konsole class

//============ 'ColorConsole' implementation class ============
class ColorConsole extends MxI.$Implementation(MxI.$ConsoleLogSink).$with(MxI.$ILogSink) 
{
    
    constructor(args) 
    {
        super();
        this._$prefix = "-> ";
    } // 'ColorConsole' constructor
    
    
    // Fallback implementation of 'ColorConsole' service
    log(arg_msg, log_level)
    {
        if      (log_level == LOG_LEVEL.OK ) console.log(chalk.green(arg_msg));

        else if (log_level == LOG_LEVEL.MSG )
            console.log(chalk.hex('#FE2EF7')(arg_msg));

        else if (log_level == LOG_LEVEL.INFO )
            console.log(chalk.hex('#a2dcfa')(arg_msg));

        else if (log_level == LOG_LEVEL.WARNING )
            console.log(chalk.yellow( "!!! " + arg_msg));

        else if (log_level == LOG_LEVEL.ERROR )
            console.log(chalk.hex('#D8D8D8').bgHex('#8A0808')( "*** " + arg_msg + " ***"));

        else if (log_level == LOG_LEVEL.CRITICAL )
        {
            var critical_msg = "  F* word  [ " + arg_msg + " ] F* word  ";

            console.log( chalk.white.bold.bgHex('#FF00FF')("=".repeat(critical_msg.length)) );
            console.log( chalk.white.bold.bgHex('#FF00FF')(critical_msg));
            console.log( chalk.white.bold.bgHex('#FF00FF')("=".repeat(critical_msg.length)));
            assert(false);
        }
        
        else 
            console.log(chalk.white(arg_msg));
            
    } // $ILogSink.log()
} // 'ColorConsole' class
  MxI.$setClass(ColorConsole).$asImplementationOf(MxI.$ILogSink);
  exports.ColorConsole = ColorConsole;


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
  exports.FileLogger = FileLogger;

  init_log_sinks();

  exports.konsole = konsole;
  exports.LOG_LEVEL = LOG_LEVEL ;
