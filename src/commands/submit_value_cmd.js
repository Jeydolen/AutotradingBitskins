const { Config } = require("../config");

const Konst                 = rekwire ('/src/constants.js');
const konsole               = rekwire ('/src/bb_log.js').konsole;
const LOG_LEVEL             = rekwire ('/src/bb_log.js').LOG_LEVEL;
const Command               = rekwire ('/src/commands/command.js').Command;


class SubmitValueCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
    }

    execute ( args )
    {
        console.log ('C4EST BIEN T4ES ARRIV2 JUSQU4ICI' + JSON.stringify(args) );
        Config.GetSingleton()._setAppVar( args.entity_name, args.entity_value );
        
    }
}
exports.SubmitValueCmd = SubmitValueCmd;