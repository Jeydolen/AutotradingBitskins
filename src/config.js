const fs            = require ('fs');
const APP_ROOT_PATH = require ('app-root-path');
const ini           = require ('multi-ini');
const assert        = require ('assert')


// Permet d'enregistrer au niveau de global rekwire (pck ipcMain)
global.rekwire = require('app-root-path').require;
if      ( !global[rekwire] )       global[rekwire] = rekwire;

// KONSOLE n'est pas compatible avec le moment ou cette Classe est utilisé (dépendance circulaire)
//const { konsole, LOG_LEVEL} = rekwire('/src/bb_log.js');
const Singleton             = rekwire("/src/singleton.js").Singleton;
const Konst                 = rekwire('/src/constants.js');


class Config extends Singleton
{
    static Singleton = null;
    static IsProd = 'IsProd';
    static PageIndexStart = 'PageIndexStart';

    constructor (args)
    {
        super (args);
        this.AppVars = new Map();
        this._setAppVar( Config.IsProd, true);
        this._setAppVar( Config.PageIndexStart, 1);
        this.init();
    } // constructor

    init()
    {
        var config_setting = ini.read( APP_ROOT_PATH + "/config.ini");

        var page_index_start = Number(config_setting.db.page_index_start);
        console.log(page_index_start + ' ' +  typeof page_index_start)
        this._setAppVar( Config.PageIndexStart, page_index_start);

        var is_prod = config_setting.db.is_prod;
        console.log ("Is prod ? :" + is_prod);
        this._setAppVar( Config.IsProd, is_prod);
    }

    // Attention 2 process 'browser' (Node) et 'renderer' ( Chromium) bien savoir dans lequel on est
    _setAppVar (name_arg, value_arg)
    {
        assert (typeof name_arg == 'string' && name_arg != undefined && name_arg != null && name_arg != '');
        assert (value_arg != undefined && value_arg != null && value_arg != '');

        if (name_arg == Config.PageIndexStart )
            Number(value_arg);
        this.AppVars.set(  name_arg, value_arg);
    }

    getAppVar( name_arg )
    {
        assert (typeof name_arg == 'string' && name_arg != undefined && name_arg != null && name_arg != '')
        console.log("name_arg " + name_arg);
        if (this.AppVars.has(name_arg ))
        {
            return this.AppVars.get( name_arg );
        }
        else
            return Konst.RC.KO

        return Konst.NOTHING;
    } // getAppVar()
}
exports.Config = Config;

const unitTest =  () =>
{
    Config.GetSingleton()
}
//unitTest()