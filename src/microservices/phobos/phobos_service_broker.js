
const  ServiceBroker            = require("moleculer").ServiceBroker;
const  ApiService               = require("moleculer-web");
const  fs                       = require("fs");
const  APP_ROOT_PATH            = require ('app-root-path');


// https://github.com/inxilpro/node-app-root-path 
// Permet d'enregistrer au niveau de global rekwire (pck autre process)
global.rekwire = require('app-root-path').require;
if      ( !global[rekwire] )       global[rekwire] = rekwire;

const { Session }       = rekwire("/src/session.js");
const { Singleton }     = rekwire("/src/singleton.js");


//https://medium.com/moleculer/moleculer-a-modern-microservices-framework-for-nodejs-bc4065e6b7ba
class PhobosServiceBroker extends Singleton
{

    static Singleton = null;

    constructor (args)
    {
        super (args);
        this.broker = new ServiceBroker
        ({
            nodeID: 'Phobos',
            metrics: true,
            logger:  true,
            logFormatter: "short",
        });

        // Create a service
        this.broker.createService
        ({
            name: "phobos",
            mixins: [ApiService],
            settings: 
            {
                // https://fr.wikipedia.org/wiki/Intel_8080
                port: 8080,
                assets: { folder: APP_ROOT_PATH + '/src/microservices/phobos/assets/'},
                routes: 
                [{ 
                    path: "phobos",
                }]
            },
            actions: 
            {
            }
        });
        this.broker.loadServices( APP_ROOT_PATH + "/src/microservices/phobos/services/", "*.service.js");
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
exports.PhobosServiceBroker = PhobosServiceBroker;