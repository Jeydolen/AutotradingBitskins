let db_panel    = Vue.component
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

exports.db_panel = db_panel;