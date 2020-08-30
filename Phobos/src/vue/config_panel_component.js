let config_panel    = Vue.component
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
        start_page_index: ipcGetAppVar(microservice_stella_url + '/session/get_app_var?name=PageIndexStart')
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

exports.config_panel = config_panel;