// Permet d'enregistrer au niveau de window rekwire (pck ipcRenderer)
global.rekwire = require('app-root-path').require;
if (! window.rekwire)       window[rekwire] = rekwire;

const Config = rekwire ('/src/config.js').Config;
// https://fr.vuejs.org/v2/guide/index.html

var home_panel    = Vue.component
(
  'home-panel',
  {
    template:`<div id='panel' v-bind:style="{ width: $parent.getWidth('panel')}">          
                <div id='progress-label'>Traitement des <span id='type-label'>item</span> dans la page: <span id='page-label'>0</span> </div>
                  <div id="progress-bar">
                      <div id="progress-bar-value"></div>
                  </div>
                <button id='populate-button' type="button" onclick="onPopulate()">Start Populate!</button>
                <button id='profitable-skin-button' type="button" onclick="onCheckSkin()">Check if profitable skins are available!</button>
              </div>`
  }
); // home_panel

var config_panel    = Vue.component
(
  'config-panel',
  {
    data: function ()
    { return {
      start_page_index: Config.GetSingleton().getAppVar(Config.PageIndexStart)
      }
    },
    template:`<div id='panel' v-bind:style="{ width: $parent.getWidth('panel')} "  >
                <form onsubmit='onSubmit()'>
                <label for='` + Config.PageIndexStart + `'> Page index: </label>       
                <input id='` + Config.PageIndexStart + `' onfocus='onFocus("` + Config.PageIndexStart + `")' class='input-value' type='text' name= '` 
                             + Config.PageIndexStart + `' :value='start_page_index'>
                </form>
              </div>` // ---------------------^^^^^^^^^^^-----------------------------------------------
  }
); // config_panel

var vertical_menu = Vue.component
( 'vertical-menu',
  { 
    template: `<nav class="menu-bar">
                  <div class="menu_item"  v-on:click="$root.swapPanel('home')"> Accueil </div>
                  <div class="menu_item"  v-on:click="$root.swapPanel('config')"> Config  </div>
              </nav>`
  }
);

var app = new Vue
(
  {
    el: '#app',
    data: 
    {
      menu_displayed: false,
      currentComponent : config_panel,
      width : { 'menu': '0.5%', 'panel': '98%' }
    },

    methods:
    {
      toggleMenu: function (event)
      { 
        
        this.menu_displayed = ! this.menu_displayed;
        var menu    = document.getElementById('menu');
        var content = document.getElementById('panel');

        if ( ! this.menu_displayed)
        { this.width['menu']   = '0.5%';
          this.width['panel']  = '98%';
        }
        else 
        { // 'menu' is displayed
          this.width['menu']   = '12.5%';
          this.width['panel']  = '80.75%';
        }
      }, // toggle_menu

      swapPanel: function (panel_name)
      {
        this.currentComponent = panel_name == 'home' ? home_panel : config_panel;
      },

      getWidth: function (id_arg)
      { 
        return this.width[id_arg];
      } // getWidth()
    },

    components: 
    {
      'vertical-menu' : vertical_menu,
      'home-panel'    : home_panel,
      'config-panel'  : config_panel
    }

  }
);