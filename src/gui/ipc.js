const { ipcRenderer } = require('electron');
const remote = require('electron').remote;

if (global.rekwire == undefined)
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
    
ipcRenderer.on( GUI.EVENT.get(GUI.POPULATE_DB_PROGRESS_EVT).value, (event, obj_arg) => 
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
    ipcRenderer.send (GUI.EVENT.get(GUI.START_POPULATE_DB_EVT).value, null);
    console.log('Bouton populate');
    var populate_button          = document.getElementById("populate-button");
    populate_button.disabled = true ;
}

const onClickCheckSkinButton = () =>
{
    ipcRenderer.send (GUI.EVENT.get(GUI.PROFIT_SLCT_SKIN_EVT).value, null);
    console.log('Bouton check skin');
}

function setProgressBarValue( value ) 
{
    if (value > 100) value = 100;
    var pbar_value          = document.getElementById("progress-bar-value");
    pbar_value.style.width = value + "%";
    pbar_value.innerHTML = value + "%";  
} // setProgressBarValue()