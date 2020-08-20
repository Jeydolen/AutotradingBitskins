const { konsole, LOG_LEVEL} = rekwire ('/src/bb_log.js');
const Command               = rekwire ('/src/commands/command.js').Command;

// https://www.geek-directeur-technique.com/2017/07/17/utilisation-de-mysqldump
class UpdateProgressCmd extends Command
{
    constructor( name ) 
    {
        super (name); 
        this.name = name;
    }

    execute ( obj_arg )
    { 
        let percent_value = (obj_arg.value / obj_arg.max_value) * 100;
        this.setProgressBarValue( Math.trunc(percent_value) );
        console.log ('Process :' + process.type )
    
        let type_label =    document.getElementById("type-label");
        let page_label =    document.getElementById("page-label");
    
        if ( type_label == undefined ||  page_label == undefined)
            return ;
    
        type_label.innerHTML = obj_arg.type;
        page_label.innerHTML = obj_arg.page;
      
    } // execute

    setProgressBarValue ( value )
    {
        if (value > 100) value = 100;
        let pbar_value          = document.getElementById("progress-bar-value");
        if ( pbar_value != null)
        {
            pbar_value.style.width = value + "%";
            pbar_value.innerHTML = value + "%";  
        }
    } // setProgressBarValue()
}

exports.UpdateProgressCmd = UpdateProgressCmd;