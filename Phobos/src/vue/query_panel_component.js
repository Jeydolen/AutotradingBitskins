let query_panel    = Vue.component
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
); // 'query_panel' Vue component

exports.query_panel = query_panel;