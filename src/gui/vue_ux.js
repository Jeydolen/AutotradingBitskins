// Permet d'enregistrer au niveau de window rekwire (pck ipcRenderer)
global.rekwire = require('app-root-path').require;
if (! window.rekwire)       window[rekwire] = rekwire;

// https://fr.vuejs.org/v2/guide/index.html

var app = new Vue
(
  {
    el: '#app',
    data: 
    {
      menu_displayed: false,
      menu_width: '0.5%',
      content_width: '99%'
    },
    methods:
      {
        toggleMenu: function (event)
        { 
          
          this.menu_displayed = ! this.menu_displayed;
          var menu    = document.getElementById('menu');
          var content = document.getElementById('content');
          console.log ('TEST'+ content.width);
          if ( ! this.menu_displayed)
          {
            this.content_width = '99%';
            this.menu_width = '0.5%';
          }
          else 
          { // 'menu' is displayed
            this.content_width = '75.75%';
            this.menu_width = '18.5%';
          }
        }, // toggle_menu

        getWidth: function (id_arg)
        { 
          var width = 0;
          switch (id_arg)
          { case 'menu':    width = this.menu_width; break;
            case 'content': width = this.content_width; break;
          }
          return width;
        } // get_width
      }
  }
)