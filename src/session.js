// Permet d'enregistrer au niveau de global rekwire (pck ipcMain)
if (global.rekwire == undefined)
    global.rekwire = require ('app-root-path').require;
    
const Config                    = rekwire('/src/config.js').Config;
const GUI                       = rekwire('/src/gui/GUI.js').GUI;
const Singleton                 = rekwire("/src/singleton.js").Singleton;


class Session extends Singleton
{
    static Broker     = "broker";
    static MainWindow = "main-window";
    static DB_Name    = "db-name";
    static IsProd     = null;

    constructor (args)
    {
        super (args)
        this.AppVars = new Map();
        this.subscribers = new Map();

        this.init();
        
    } // constructor

    init ()
    {
        this.AppVars.set( Session.Broker, null );
        this.AppVars.set( Session.MainWindow, null );
        
        this.AppVars.set( Session.IsProd,  Config.GetSingleton().getAppVar(Config.IsProd) );

        var db_name = "bitskins_csgo_dev"; 
        if (Session.IsProd)
            db_name = "bitskins_csgo_prod";

        console.log ('Base de donnée selectionée : ' + db_name);
        this.AppVars.set( Session.DB_Name, db_name );

        this.subscribers.set(  GUI.EVENT.get(GUI.APP_VAR_CHANGED_EVT), [] );

    }
    subscribe( subscriber_obj, event_arg )
    {
        if (this.subscribers.has(event_arg ))
        {
            var index_of = this.subscribers.get( event_arg).indexOf(subscriber_obj);
            if ( this.subscribers.get( event_arg).indexOf(subscriber_obj) == -1 )
            {
                this.subscribers.get( event_arg ).push( subscriber_obj );
            }
        }
    } // subscribe

    setAppVar( name_arg, value_arg)
    {
        if (this.AppVars.has(name_arg ))
        {
            var previous_value = this.AppVars.get( name_arg );
            if ( previous_value != value_arg )
            {
                this.AppVars.set( name_arg, value_arg );

                var event_subscribers = this.subscribers.get( GUI.EVENT[GUI.APP_VAR_CHANGED_EVT] );

                for ( var i=0; i< event_subscribers.length; i++ )
                {
                    var subscriber_obj = event_subscribers[i];
                    if (subscriber_obj != undefined) 
                    { 
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