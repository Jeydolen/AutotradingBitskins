
const  ServiceBroker            = require("moleculer").ServiceBroker;
const  ApiService               = require("moleculer-web");
const  fs                       = require("fs");
const  APP_ROOT_PATH            = require ('app-root-path');

// https://github.com/inxilpro/node-app-root-path 
// Permet d'enregistrer au niveau de global rekwire (pck autre process)
global.rekwire = require('app-root-path').require;
if      ( !global[rekwire] )       global[rekwire] = rekwire;

const { Singleton }     = rekwire("/src/singleton.js");


//https://medium.com/moleculer/moleculer-a-modern-microservices-framework-for-nodejs-bc4065e6b7ba
class GuiServiceBroker extends Singleton
{

    static Singleton = null;

    constructor (args)
    {
        super (args);
        this.broker = new ServiceBroker
        ({
            metrics: true,
            logger:  true,
            port:    6001,
            logFormatter: "short",
        });

        // Create a service
        this.broker.createService
        ({
            name: "ui",
            mixins: [ApiService],
            settings: 
            {
                assets: { folder: APP_ROOT_PATH + '/src/microservices/assets/'},
                routes: 
                [{ 
                    path: "/api"
                }]
            },
            actions: 
            {
            }
        });
        this.broker.loadServices( APP_ROOT_PATH + "/src/microservices/api/", "*.service.js");
    } // Constructor
    

    start (args)
    {
        this.broker.start()//.then( () => this.broker.repl() );
        Session.GetSingleton().setAppVar( Session.Broker, this.broker );
    }
} // ServiceBroker class


const unitTest = () =>
{
    ServiceBroker.GetSingleton().start();
}; 

//unitTest();


exports.BB_ServiceBroker = BB_ServiceBroker;