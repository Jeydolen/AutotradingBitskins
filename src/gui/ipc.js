const { ipcRenderer } = require('electron');
const { createPool } = require('mysql');
global.rekwire        = require('app-root-path').require;

const GUI           = rekwire ('/src/gui/GUI.js').GUI;
    
ipcRenderer.on('populate-db-progress', (event, obj_arg) => 
{
    var percent_value = (obj_arg.value / obj_arg.max_value) * 100;
    setProgressBarValue( Math.trunc(percent_value) );

    var type_label =  document.getElementById("type-label");
    type_label.innerHTML = obj_arg.type;

    var page_label = document.getElementById("page-label");
    page_label.innerHTML = obj_arg.page;
});

const onClickPopulateButton = () =>
{
    ipcRenderer.send (GUI.START_UPDATE_DB_EVT, null);
    var update_button          = document.getElementById("populate-button");
    update_button.disabled = true ;
}

function setProgressBarValue( value ) 
{
    if (value > 100) value = 100;
    var pbar_value          = document.getElementById("progress-bar-value");
    pbar_value.style.width = value + "%";
    pbar_value.innerHTML = value + "%";  
} // setProgressBarValue()