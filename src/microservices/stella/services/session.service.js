const { TradeUp }        = require("../../../model/trade_up");
const { BitskinsObject } = require("../../../model/bb_obj");
const Konst              = rekwire ('/src/constants.js') ;

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

        unit_test ( ctx ) 
        {
            let klass_name = ctx.params.class != undefined ? ctx.params.class : "BitskinsObject";

            let klass = klass_name == "TradeUp"  ?   TradeUp : 
                                                     BitskinsObject;

            let result = Konst.NOTHING;
            try
            {   result = klass.UnitTest( ctx ); }
            catch( err )
            {   result = "UnitTest() not defined in " + klass.name; }

            ctx.meta.$responseType = "text/json ; charset=utf-8";
            return result;
        }, // get_app_var()

        log ( ctx ) 
        {
            console.log("stella/session/log " + ctx.params.msg);
            return "log";
        } // log()
    } // actions for "session" service
};