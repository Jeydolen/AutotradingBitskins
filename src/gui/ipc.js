const { ipcRenderer } = require('electron');
global.rekwire        = require('app-root-path').require;

const GUI           = rekwire ('/src/gui/GUI.js').GUI;
    
ipcRenderer.on('populate-db-progress', (event, arg) => 
{
    
    var percent_value = (arg / 480) * 100;
    setProgressBarValue( Math.trunc(percent_value) );
});

const onClickUpdateButton = () =>
{
    ipcRenderer.send (GUI.START_UPDATE_DB_EVT, null);
    var update_button          = document.getElementById("update-button");
    update_button.disabled = true ;
}

function setProgressBarValue( value ) 
{
    if (value > 100) value = 100;
    var pbar_value          = document.getElementById("progress-bar-value");
    pbar_value.style.width = value + "%";
    pbar_value.innerHTML = value + "%";
    
}