let home_panel =  Vue.component
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

exports.home_panel = home_panel;
