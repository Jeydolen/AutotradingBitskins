const { ipcRenderer } = require('electron');
const remote = require('electron').remote;
const { createPool } = require('mysql');
global.rekwire        = require('app-root-path').require;

const GUI           = rekwire ('/src/gui/GUI.js').GUI;

document.addEventListener("keydown", function (e) {
    console.log(e.which);

    // F12
    if (e.which === 123) {
        remote.getCurrentWindow().toggleDevTools();
    } else if (e.which === 116) {
        location.reload();
    }
});
    
ipcRenderer.on( GUI.EVENTS.get(GUI.POPULATE_DB_PROGRESS_EVT).value, (event, obj_arg) => 
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
    ipcRenderer.send (GUI.EVENTS.get(GUI.START_POPULATE_DB_EVT).value, null);
    console.log('Bouton');
    var populate_button          = document.getElementById("populate-button");
    populate_button.disabled = true ;
}

const onClickStopButton = () =>
{
    ipcRenderer.send (GUI.EVENTS.get(GUI.STOP_IPC_MAIN_EVT).value, null);
    console.log('onClickStopButton Stop');
    var stop_button = document.getElementById("stop-button");
    stop_button.disabled = true ;
}

function setProgressBarValue( value ) 
{
    if (value > 100) value = 100;
    var pbar_value          = document.getElementById("progress-bar-value");
    pbar_value.style.width = value + "%";
    pbar_value.innerHTML = value + "%";  
} // setProgressBarValue()