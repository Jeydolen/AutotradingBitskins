// Vue_ux ne fonctionne PAS sans ipc.js (tout les requires dedans + fonctions (require de ipc fait depuis le .html) )

// https://fr.vuejs.org/v2/guide/index.html



global.rekwire = require('app-root-path').require;
if (! window.rekwire)       window[rekwire] = rekwire;

const { PhobosServiceBroker }     = rekwire('/src/microservices/phobos/phobos_service_broker');

const { vertical_menu       }     = rekwire ('/src/gui/vue/vertical_menu_component.js'       );


const { home_panel          }     = rekwire ('/src/gui/vue/home_panel_component.js'         );
const { config_panel        }     = rekwire ('/src/gui/vue/config_panel_component.js'       );
const { db_panel            }     = rekwire ('/src/gui/vue/db_panel_component.js'           );
const { query_panel         }     = rekwire ('/src/gui/vue/query_panel_component.js'        );

let microservice_stella_url = 'http://localhost:51374/stella'

let app = new Vue
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
        let menu    = document.getElementById('menu');
        let content = document.getElementById('panel');

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
        if      (panel_name == 'home'         ) this.currentComponent = home_panel;
        else if (panel_name == 'config'       ) this.currentComponent = config_panel;
        else if (panel_name == 'db'           ) this.currentComponent = db_panel;
        else if (panel_name == 'query'        ) this.currentComponent = query_panel;
        else this.currentComponent = home_panel;

      },

      setActiveMenuItemClass: function (panel_name)
      {
        this.menu_item_class.home         = 'home';
        this.menu_item_class.config       = 'config';
        this.menu_item_class.db           = 'db';
        this.menu_item_class.query        = 'query'

        this.menu_item_class[panel_name] = panel_name + '-active';
      },

      getWidth: function (id_arg)
      { 
        return this.width[id_arg];
      } // getWidth()
    },

    components: 
    {
      'vertical-menu'       : vertical_menu,
      'db-panel'            : db_panel,
      'home-panel'          : home_panel,
      'config-panel'        : config_panel,
      'query-panel'         : query_panel
    }
  }
); // app 'Vue View'

PhobosServiceBroker.GetSingleton().start();