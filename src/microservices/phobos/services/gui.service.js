const Konst             = rekwire ('/src/constants.js');
const UpdateProgressCmd = rekwire ('/src/microservices/phobos/commands/update_progress_cmd.js').UpdateProgressCmd;

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
        update (ctx)
        {
            let reason              = ctx.params.reason     != undefined ? ctx.params.reason    : Konst.Reason.Progress;
            if ( reason == Konst.Reason.Progress )
            {            
                let value           = ctx.params.value      != undefined ? ctx.params.value     : 0;
                let max_value       = ctx.params.max_value  != undefined ? ctx.params.max_value : 480;
                let obj_arg         = { 'value' : value, 'max_value' : max_value}
                UpdateProgressCmd.GetSingleton().execute(obj_arg);
            }
            return ( 'Coucou ')
        }
    }
};