// Vue_ux ne fonctionne PAS sans ipc.js (tout les requires dedans + fonctions (require de ipc fait depuis le .html) )

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
      //start_page_index: Config.GetSingleton().getAppVar(Config.PageIndexStart)
        start_page_index: Session.GetSingleton().getAppVar(Session.PageIndexStart)
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


var vertical_menu = Vue.component
( 'vertical-menu',
  { 
    template: `<nav :class="$root.menu_bar" v-on:click.prevent>
                  <div id='home-menu-item' class="home"  v-on:click="$root.swapPanel('home')"> Accueil </div>
                  <div id='config-menu-item'class="config"  v-on:click="$root.swapPanel('config')"> Config  </div>
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
      menu_bar: 'home-menu-item',
      currentComponent : home_panel,
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

        var previous_menu_item = this.menu_bar;
        this.menu_bar = panel_name + '-menu-item';

        document.getElementById(previous_menu_item).style = 'background-color: #2E2E2E;';
        document.getElementById(panel_name + '-menu-item').style = 'background-color: rgb(161, 161, 161); color: black';
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
); // app 'Vue View'