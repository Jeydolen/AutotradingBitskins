// Vue_ux ne fonctionne PAS sans ipc.js (tout les requires dedans + fonctions (require de ipc fait depuis le .html) )

// https://fr.vuejs.org/v2/guide/index.html

var home_panel    = Vue.component
(
  'home-panel',
  {
    data: function ()
    { return {
      }
    },
    template:`<div id='panel' v-bind:style="{ width: $parent.getWidth('panel')}">          
                <div id='progress-label'>Traitement des <span id='type-label'>item</span> dans la page: <span id='page-label'>0</span> </div>
                  <div id="progress-bar">
                      <div id="progress-bar-value"></div>
                  </div>
                <button id='populate-button' type="button" onclick="onPopulate(); return false">Start Populate!</button>
                <button id='profitable-skin-button' type="button" onclick="onCheckSkin()">Check if profitable skins are available!</button>
              </div>`
  }
); // 'home_panel' Vue component


var config_panel    = Vue.component
(
  'config-panel',
  {
    data: function ()
    { return {
        start_page_index: 1 
      }
    },
    template:`<div id='panel' v-bind:style="{ width: $parent.getWidth('panel')} "  >
                <form onsubmit='onSubmit(); return false'>
                <label for='` + Session.PageIndexStart + `'> Page index: </label>       
                <input id='`  + Session.PageIndexStart + `' onfocus='onFocus("` + Session.PageIndexStart + `")' class='input-value' type='number' name= '` 
                              + Session.PageIndexStart + `' v-model.number='start_page_index'>
                </form>
              </div>`
  }
); // 'config_panel' Vue component


var db_panel    = Vue.component
(
  'db-panel',
  {
    data: function ()
    { return {

      }
    },
    template:`<div id='panel' v-bind:style="{ width: $parent.getWidth('panel')} "  >
                <button id='populate-button' type="button" onclick="onDbButton('populate'); return false">Start Populate! (fetch)</button> <br>
                <button id='backup-button'   type="button" onclick="onGUIButton('backup_as'); return false">Backup As...</button><br>
                <button id='restore-button'  type="button" onclick="onPopulate('restore'); return false">Start restore!</button><br>
              </div>`
  }
); // 'db_panel' Vue component

var vertical_menu = Vue.component
( 'vertical-menu',
  { 
    template: `<nav class="menu-bar" v-on:click.prevent>
                  <div id='home-menu-item'    :class="$root.menu_item_class.home"     v-on:click="$root.setPanel('home')">    Accueil </div>
                  <div id='config-menu-item'  :class="$root.menu_item_class.config"   v-on:click="$root.setPanel('config')">  Config  </div>
                  <div id='db-menu-item'      :class="$root.menu_item_class.db"       v-on:click="$root.setPanel('db')">      DB      </div>
                  
              </nav>`
  }
); // 'vertical_menu' Vue component


var app = new Vue
(
  {
    el: '#app',
    data: 
    {
      menu_displayed: false,
      currentComponent : db_panel,
      width : { 'menu': '0.5%', 'panel': '98%' },
      menu_item_class: { 'home': 'home-active', 'config': 'config', 'db': 'db'}
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

      setPanel: function (panel_name)
      {

        this.setActiveMenuItemClass (panel_name)
        if      (panel_name == 'home'  ) this.currentComponent = home_panel;
        else if (panel_name == 'config') this.currentComponent = config_panel;
        else if (panel_name == 'db'    ) this.currentComponent = db_panel;
        else this.currentComponent = home_panel;

      },

      setActiveMenuItemClass: function (panel_name)
      {
        this.menu_item_class.home = 'home';
        this.menu_item_class.config = 'config';
        this.menu_item_class.db = 'db';

        this.menu_item_class[panel_name] = panel_name + '-active';
      },

      getWidth: function (id_arg)
      { 
        return this.width[id_arg];
      } // getWidth()
    },

    components: 
    {
      'vertical-menu' : vertical_menu,
      'db-panel'      : db_panel,
      'home-panel'    : home_panel,
      'config-panel'  : config_panel
    }
  }
); // app 'Vue View'