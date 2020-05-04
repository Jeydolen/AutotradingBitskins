const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const Enum = require('enum');
const chalk = require ('chalk');


const LOG_LEVEL = new Enum (['OK', 'ERROR', 'WARNING', 'MSG'])

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

        else if (log_level == LOG_LEVEL.ERROR )
            console.log(chalk.hex('#D8D8D8').bgHex('#8A0808')( "*** " + arg_msg + " ***"));
        else if (log_level == LOG_LEVEL.WARNING )
            console.log(chalk.yellow( "!!! " + arg_msg));

        else if (log_level == LOG_LEVEL.MSG )
            console.log(chalk.hex('#FE2EF7')(arg_msg));
        
        else console.log(chalk.white(arg_msg));
            
    } // $ILogSink.log()
} // 'ColorConsole' class
  MxI.$setClass(ColorConsole).$asImplementationOf(MxI.$ILogSink);
  exports.ColorConsole = ColorConsole;
  exports.LOG_LEVEL = LOG_LEVEL;