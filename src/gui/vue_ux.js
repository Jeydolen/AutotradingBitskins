// Vue_ux ne fonctionne PAS sans ipc.js (tout les requires dedans + fonctions (require de ipc fait depuis le .html) )

// https://fr.vuejs.org/v2/guide/index.html

var microservice_stella_url = 'http://localhost:51374/stella'


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
                <button id='populate-button' type="button" onclick="onServiceCall('db', 'populate'); return false;">Start Populate!</button>
              </div>`
  }
); // 'home_panel' Vue component


var config_panel    = Vue.component
(
  'config-panel',
  {
    /*
    props: 
    [
      'start_page_index', 'skin_set_param', 'skin_state_param', 'skin_rarity_param'
    ],
    */
    data: function ()
    { return {
        start_page_index: ipcGetAppVar(microservice_stella_url + '/session?name=PageIndexStart')
      }
    },
    template:`<div id='panel' v-bind:style="{ width: $parent.getWidth('panel')} "  >
                <form onsubmit='onSubmit(); return false'>
                  <table> 
                    <tr>
                        <td> <label for='PageIndexStart'> Page index: </label>  </td>
                        <td> <input id='PageIndexStart' onfocus='onFocus("PageIndexStart")' class='input-value' type='number' name= 'PageIndexStart' v-model.number='start_page_index'>  </td>
                    </tr>
                  </table>
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
                <button id='populate-button' type="button" onclick="onServiceCall('db', 'populate'); return false">Start Populate! (fetch)</button> <br>
                <button id='backup-button'   type="button" onclick="onServiceCall('db', 'backup'); return false">Backup As...</button><br>
                <button id='restore-button'  type="button" onclick="onServiceCall('db', 'restore'); return false">Start restore!</button><br>
              </div>`
  }
); // 'db_panel' Vue component

var query_panel    = Vue.component
(
  'query-panel',
  {
    data: function ()
    { return {
        skin_set_param  : 1,
        skin_state_param: 1,
        skin_rarity_param: 1
      }
    },
    // https://stackoverflow.com/questions/42694457/getting-form-data-on-submit
    template:`<div id='panel' v-bind:style="{ width: $parent.getWidth('panel')} "  >
                <form id='query-panel-form' onSubmit="onFormSubmit('query-panel-form'); return false">
                <table> 
                  <tr>
                    <td> <label for='skin_set_value'> Skin Set: </label> </td>
                    <td> <input id='skin_set_value' onfocus='onFocus("skin_set_value")' class='input-value' type='number' name= 'skin_set_value' v-model.number='skin_set_param'> </td> 
                  </tr>

                  <tr>
                    <td> <label for='skin_state_value'> Skin state: </label> </td>
                    <td> <input id='PageIndexStart' onfocus='onFocus("skin_state_value")' class='input-value' type='number' name= 'skin_state_value' v-model.number='skin_state_param'> </td>
                  </tr>

                  <tr>
                    <td>  <label for='skin_rarity_value'> Skin rarity: </label> </td>
                    <td>  <input id='skin_rarity_value' onfocus='onFocus("skin_rarity_value")' class='input-value' type='number' name= 'skin_rarity_value' v-model.number='skin_rarity_param'> </td>
                  </tr>

                  <button id='profitable-skin-button' type="submit" >Check if profitable skins are available!</button>

                </table>
                </form>
              </div>`
  }
); // 'config_panel' Vue component

var vertical_menu = Vue.component
( 'vertical-menu',
  { 
    template: `<nav class="menu-bar" v-on:click.prevent>
                  <div id='home-menu-item'    :class="$root.menu_item_class.home"     v-on:click="$root.setPanel('home')">    Accueil </div>
                  <div id='config-menu-item'  :class="$root.menu_item_class.config"   v-on:click="$root.setPanel('config')">  Config  </div>
                  <div id='db-menu-item'      :class="$root.menu_item_class.db"       v-on:click="$root.setPanel('db')">      DB      </div>
                  <div id='query-menu-item'   :class="$root.menu_item_class.query"    v-on:click="$root.setPanel('query')">   Query   </div>
                  
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
        else if (panel_name == 'query' ) this.currentComponent = query_panel;
        else this.currentComponent = home_panel;

      },

      setActiveMenuItemClass: function (panel_name)
      {
        this.menu_item_class.home = 'home';
        this.menu_item_class.config = 'config';
        this.menu_item_class.db = 'db';
        this.menu_item_class.query = 'query'

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
      'config-panel'  : config_panel,
      'query-panel'  : query_panel
    }
  }
); // app 'Vue View'