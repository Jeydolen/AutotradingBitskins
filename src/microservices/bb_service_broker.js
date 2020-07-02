
const  ServiceBroker            = require("moleculer").ServiceBroker;
const  ApiService               = require("moleculer-web");
const  APP_ROOT_PATH            = require ('app-root-path');
const { path }                  = require("app-root-path");
const { konsole }               = require("../bb_log");

// https://github.com/inxilpro/node-app-root-path 
// Permet d'enregistrer au niveau de global rekwire (pck autre process)
global.rekwire = require('app-root-path').require;
if      ( !global[rekwire] )       global[rekwire] = rekwire;

const { Singleton }     = rekwire("/src/singleton.js");


//https://medium.com/moleculer/moleculer-a-modern-microservices-framework-for-nodejs-bc4065e6b7ba
class BB_ServiceBroker extends Singleton
{

    static Singleton = null;

    constructor (args)
    {
        super (args);
        this.broker = new ServiceBroker
        ({
            metrics: true,
            logger: false,
            logFormatter: "short"
        });

        // Create a service
        this.broker.createService
        ({
            name: "api",
            mixins: [ApiService],
            settings: 
            {
                routes: 
                [
                    { path: "/api" }
                ]
            },
            actions: 
            {
                rest: 
                {
                    metrics: 
                    {
                        params: ({ req, res }) => 
                        {
                            return {
                                http: 
                                {
                                    method: req.method,
                                    url: req.url,
                                    statusCode: res.statusCode
                                }};
                        }
                    }
                }
            }
        });
        this.broker.loadService( APP_ROOT_PATH + "/src/microservices/db.service.js");
    } // Constructor
    

    start (args)
    {
        this.broker.start()//.then( () => this.broker.repl() );
        konsole.SetBroker( this.broker );
    }
} // ServiceBroker class


const unitTest = () =>
{
    ServiceBroker.GetSingleton().start();
}; 

//unitTest();


exports.BB_ServiceBroker = BB_ServiceBroker;