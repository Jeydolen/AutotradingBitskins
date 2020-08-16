const Session = rekwire ('/src/session.js').Session;

module.exports =
{
    name: "session",
    settings: 
    {
        routes: 
        [
            { path: "/session" }
        ]
    },

    actions: 
    { 
        get_app_var ( ctx ) 
        {
            let app_var_value = Session.GetSingleton().getAppVar(ctx.params.name);
            console.log("app_var_value " + app_var_value);
            return app_var_value;
        }, // get_app_var()

        log ( ctx ) 
        {
            console.log("stella/session/log " + ctx.params.msg);
            return "log";
        } // log()
    }
};