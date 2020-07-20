const Session = rekwire ('/src/session.js').Session;

module.exports =
{
    name: "query",
    settings: 
    {
        routes: 
        [
            { path: "/query" }
        ]
    },
    actions: 
    { 
        submit ( ctx ) 
        {
            var app_var_value = Session.GetSingleton().getAppVar(ctx.params.name);
            console.log("app_var_value " + app_var_value);
            return app_var_value;
        }
    }
};