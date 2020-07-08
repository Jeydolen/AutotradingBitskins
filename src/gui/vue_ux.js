// Permet d'enregistrer au niveau de window rekwire (pck ipcRenderer)
global.rekwire = require('app-root-path').require;
if (! window.rekwire)       window[rekwire] = rekwire;

// https://fr.vuejs.org/v2/guide/index.html

var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue !, Coucouille'
    }
  })