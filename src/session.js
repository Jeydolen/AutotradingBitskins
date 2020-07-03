

// Permet d'enregistrer au niveau de global rekwire (pck ipcMain)
global.rekwire = require('app-root-path').require;
if      ( !global[rekwire] )       global[rekwire] = rekwire;

const GUI       = rekwire('/src/gui/GUI.js').GUI;
const Singleton = rekwire("/src/singleton.js").Singleton;


class Session extends Singleton
{
    static Broker     = "broker";
    static MainWindow = "main-window";

    constructor (args)
    {
        super (args)
        this.AppVars = new Map();
        this.AppVars.set( Session.Broker, null );
        this.AppVars.set( Session.MainWindow, null );

        this.subscribers = new Map();
        this.subscribers.set(  GUI.EVENT[GUI.APP_VAR_CHANGED_EVT], [] );
    } // constructor

    subscribe( subscriber_obj, event_arg )
    {
        console.log("Session: object '" + subscriber_obj.name + "' subscribed to '" + event_arg + "'");
        if (this.subscribers.has(event_arg ))
        {
            console.log("Session.subscribe '1'");
            var index_of = this.subscribers.get( event_arg).indexOf(subscriber_obj);
            console.log("index_of " + index_of);
            if ( this.subscribers.get( event_arg).indexOf(subscriber_obj) == -1 )
            {
                console.log("Session.subscribe '2'");
                this.subscribers.get( event_arg ).push( subscriber_obj );
            }
        }
    } // subscribe

    setAppVar( name_arg, value_arg)
    {
        console.log("Session.SetAppVar '" +name_arg + "'");
        if (this.AppVars.has(name_arg ))
        {
            var previous_value = this.AppVars.get( name_arg );
            console.log("Session.SetAppVar '1'");
            if ( previous_value != value_arg )
            {
                console.log("Session.SetAppVar '2'");
                this.AppVars.set( name_arg, value_arg );

                var event_subscribers = this.subscribers.get( GUI.EVENT[GUI.APP_VAR_CHANGED_EVT] );
                console.log('event_subscribers.length ' + event_subscribers.length);

                for ( var i=0; i< event_subscribers.length; i++ )
                {
                    console.log('Yo');
                    var subscriber_obj = event_subscribers[i];
                    if (subscriber_obj != undefined) 
                    { 
                        console.log('Yolo' + subscriber_obj.name);
                        subscriber_obj.inform(  GUI.EVENT[GUI.APP_VAR_CHANGED_EVT], name_arg );
                    }
                }
            }
        }
    } // setAppVar()

    getAppVar( name_arg )
    {
        if (this.AppVars.has(name_arg ))
        {
            return this.AppVars.get( name_arg );
        }
        return Konst.NOTHING;
    } // getAppVar()
}
exports.Session = Session;