const { ipcRenderer }   = require('electron');
const assert            = require ('assert');
const fetch             = require('node-fetch');

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
        // 1st arg must be a string (also for ipc.On) => event.key
        ipcRenderer.send (GUI.EVENT.get(GUI.SHOW_DEV_TOOLS_EVT).value, null);
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
    type_label.innerHTML = obj_arg.type;

    var page_label = document.getElementById("page-label");
    page_label.innerHTML = obj_arg.page;
});

const onPopulate = () =>
{
    /*
    ipcRenderer.send (GUI.EVENT.get(GUI.START_POPULATE_DB_EVT).value, null);
    console.log('Bouton populate');
    var populate_button          = document.getElementById("populate-button");
    populate_button.disabled = true ;
    */
   
   fetch('http://localhost:3000/api/db/populate')
   .then ( (res) => 
   {
    console.log('Bouton populate');
    var populate_button          = document.getElementById("populate-button");
    populate_button.disabled = true ;
   } )
   .catch ( (err) => { console.error( 'Pas bon populate (ipc):' + err)} )
   

}

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
       
    ipcRenderer.send (GUI.EVENT.get(GUI.SUBMIT_VALUE_EVT).value, new GUI.SubmitValueEventObj ( focused_entity, value ) );
    console.log('Coucou')
}