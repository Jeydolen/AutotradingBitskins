const assert                    = require ('assert');

if (global.rekwire == undefined)
    global.rekwire = require ('app-root-path').require;


// Abstract class cf. https://www.codeheroes.fr/2017/11/08/js-classes-abstraites-et-interfaces/
class Singleton 
{
    static Instances = new Map();
    static Singleton = null;

    constructor (args)
    {
        assert( this.constructor !== Singleton, 'Abstract class "Singleton" cannot be instantiated directly' );
        this.name = args;
    } // constructor

    static GetSingleton()
    {
        var klass = this;
        //console.log ("klass: " + klass.name);
        if (klass.Singleton == null || klass.Singleton == undefined )
        {
            var name = klass.name.toUpperCase() + "_SINGLETON";
            klass.Singleton = new klass(name) ;
            klass.Instances.set ( name, klass.Singleton );
        }
        return klass.Singleton;
    } // GetSingleton()
} // Singleton class 

exports.Singleton = Singleton;
