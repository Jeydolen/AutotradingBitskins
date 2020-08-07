const { ipcRenderer }   = require('electron');
const assert            = require ('assert');
const fetch             = require('node-fetch');
const $                 = require ('jquery');

// Permet d'enregistrer au niveau de window rekwire (pck ipcRenderer)
global.rekwire = require('app-root-path').require;
if (! window.rekwire)       window[rekwire] = rekwire;

const CMD_KONST     = rekwire('/src/commands/command_constants.js').CMD_KONST;
const GUI           = rekwire ('/src/gui/GUI.js').GUI;
const { menu_item, input_text, KeyCode, DomClass} = rekwire ('/src/gui/dom_const.js');
const Session       = rekwire ('/src/session.js').Session;

document.addEventListener("keydown", function (e) 
{
    console.log(e.which);
    if ( e.which === 123 ) 
    {
        //onGUIButton('show_dev_tools');
        onServiceCall('gui', 'show_dev_tools');
    } 
    // F5
    else if (e.which === 116) 
    {
        location.reload();
    }
});
    
ipcRenderer.on( GUI.EVENT.get(GUI.POPULATE_DB_PROGRESS_EVT).value, (event, obj_arg) => 
{
    var percent_value = (obj_arg.value / obj_arg.max_value) * 100;
    setProgressBarValue( Math.trunc(percent_value) );

    var type_label =  document.getElementById("type-label");
    var page_label = document.getElementById("page-label");

    if ( type_label == undefined ||  page_label == undefined)
        return ;

    type_label.innerHTML = obj_arg.type;
    page_label.innerHTML = obj_arg.page;
});

const onServiceCall = ( service_name, action_name, args ) =>
{
    assert (action_name != null && action_name != undefined)
    assert ( typeof action_name == 'string' && action_name != '' )
    
    assert (service_name != null && service_name != undefined)
    assert ( typeof service_name == 'string' && service_name != '' )
    
    fetch('http://localhost:51374/stella/'+ service_name +'/' + action_name )
    .then ( (res) => 
    {
     console.log('Call ' + service_name + '.' + action_name);
     var action_button          = document.getElementById(action_name + "-button");
     if ( action_button != null && action_button != undefined)
     action_button.disabled = true ;
    } )
    .catch ( (err) => { console.error( 'Pas bon service/action name :' + service_name + '.' + action_name + ' ' +  err)} )
}


const ipcGetAppVar = async url => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };


const onCheckSkin = () =>
{
    var values_obj = new CMD_KONST.CMD_ARGS[CMD_KONST.PROFIT_SLCT_SKIN_ID]( 5,4,4 );

    ipcRenderer.send (GUI.EVENT.get(GUI.PROFIT_SLCT_SKIN_EVT).value, values_obj);
    console.log('Bouton check skin');
}

const setProgressBarValue = ( value ) => 
{
    if (value > 100) value = 100;
    var pbar_value          = document.getElementById("progress-bar-value");
    if ( pbar_value != null)
    {
        pbar_value.style.width = value + "%";
        pbar_value.innerHTML = value + "%";  
    }

} // setProgressBarValue()


var focused_entity = null;
const onFocus = (entity_arg) =>
{
    focused_entity = entity_arg
    console.log (focused_entity);
}

const onSubmit = () =>
{
    var value = document.getElementById(focused_entity).value
    console.log('Coucou')
    ipcRenderer.send (GUI.EVENT.get(GUI.SUBMIT_VALUE_EVT).value, new GUI.SubmitValueEventObj ( focused_entity, value ) );
}

const onFormSubmit = ( form_id ) =>
{
    var params = $("#" + form_id).serialize(); // serializes the form's elements.
    var msg = params;

    fetch('http://localhost:51374/stella/db/query?' + params)
    .then ( (res) => 
    {
        console.log('Call onFormSubmit' + params);

    } )
    .catch ( (err) => { console.error( 'Pas bon onFormSubmit :' +  err)} )


 
}