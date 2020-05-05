const MxI = require('mixin-interface-api/src/mixin_interface_api.js').MxI; 
const LOG_LEVEL = require ('./ColorConsole.js').LOG_LEVEL;
const timestamp = require ('time-stamp');

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
