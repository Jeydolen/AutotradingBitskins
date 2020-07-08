const fs            = require ('fs');
const APP_ROOT_PATH = require ('app-root-path');
const ini           = require ('multi-ini');

// Permet d'enregistrer au niveau de global rekwire (pck ipcMain)
global.rekwire = require('app-root-path').require;
if      ( !global[rekwire] )       global[rekwire] = rekwire;

const Singleton = rekwire("/src/singleton.js").Singleton;


class Config extends Singleton
{
    static IsProd = null;
    static PageIndexStart = null;

    constructor (args)
    {
        super (args)
        this.AppVars = new Map();
        this.AppVars.set( Config.IsProd, true);
        this.AppVars.set( Config.PageIndexStart, 1);
        this.init()
    } // constructor

    init()
    {
        var config_setting = ini.read( APP_ROOT_PATH + "/config.ini");

        var page_index_start = config_setting.db.page_index_start;
        this.AppVars.set( Config.PageIndexStart, page_index_start);

        var is_prod = config_setting.db.is_prod;
        console.log ("Is prod ? :" + is_prod);
        this.AppVars.set( Config.IsProd, is_prod);
    }

    getAppVar( name_arg )
    {
        if (this.AppVars.has(name_arg ))
        {
            return this.AppVars.get( name_arg );
        }
        return Konst.NOTHING;
    } // getAppVar()
}
exports.Config = Config;

const unitTest =  () =>
{
    Config.GetSingleton()
}
//unitTest()