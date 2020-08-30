let vertical_menu = Vue.component
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

exports.vertical_menu = vertical_menu;