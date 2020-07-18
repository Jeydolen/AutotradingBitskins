const ShowDevToolsCmd   = rekwire ('/src/commands/show_dev_tools_cmd.js').ShowDevToolsCmd;

module.exports =
{
    name: "gui",
    settings: 
    {
        routes: 
        [
            { path: "/gui" }
        ]
    },
    actions: 
    { 
        show_dev_tools (args) 
        {
            ShowDevToolsCmd.GetSingleton().execute(args)
            return 'Show dev tools';
        }
    }
};