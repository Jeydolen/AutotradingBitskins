const readlineSync = require('readline-sync');
const { Command } = require('commander');
const { app } = require('electron');

const PROMPT = 'CLI> ';

const program = new Command();
    

class CLIClientMs 
{
    // Read eval print loop
    // https://timber.io/blog/creating-a-real-world-cli-app-with-node/
    static repl = () =>
    {
        var harnessing_user = true;
        while ( harnessing_user )
        {
            var command_line = readlineSync.question(PROMPT);
            //console.log("command_line = '" + command_line + "'\n");
            if (command_line == '' ) continue;

            var command_args = command_line.split();
            var cmd = command_args[0].toLowerCase();

            //console.log("cmd: '" + cmd + "'\n");

            switch (cmd) 
            {
                case 'q':
                case 'quit':
                    harnessing_user = false;
                    break;

                case 'h':
                case 'help':
                    console.log (   'Usage: <command> [options]\n'
                                +   'Command List:\n'
                                +   'h, help: shows help\n'
                                +   'q, quit: exit CLI' );
                    break;
                default:
                    console.error(`"${cmd}" is not a valid command (use: h for help) !`)
                    break;
            }
        }
    }
}


const unitTest = () =>
{
    program.version('0.0.1');
    program.command ('q, quit', 'Quit program').action( () => {process.exit(1);} )
    
    CLIClientMs.repl();
};

unitTest();