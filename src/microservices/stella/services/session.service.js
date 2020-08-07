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
        getappvar ( ctx ) 
        {
            var app_var_value = Session.GetSingleton().getAppVar(ctx.params.name);
            console.log("app_var_value " + app_var_value);
            return app_var_value;
        }, // getAppVar()

        log ( ctx ) 
        {
            console.log("api/session/log " + ctx.params.msg);
            return "log";
        } // log()
    }
};