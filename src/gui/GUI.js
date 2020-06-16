const Enum      = require('enum');
const expand    = require ('expand-template')();
//const Konst     = rekwire('/src/constants.js');


class GUI
{
    static POPULATE_DB_PROGRESS_EVT = "POPULATE_DB_PROGRESS_EVT";
    static START_UPDATE_DB_EVT = "START_UPDATE_DB_EVT";
    static UNKNOWN_EVT  = "UNKNOWN_EVT";
    static EVENTS       = new Enum ({ UNKNOWN_EVT: "unknown-evt", POPULATE_DB_PROGRESS_EVT : 'populate-db-progress', START_UPDATE_DB_EVT : 'start-update-db'});
    //static EVENT_ARGS  = {POPULATE_DB_PROGRESS_EVT : { 'type' : Konst.NOTHING, 'value' : 0, 'max' : 0, 'page' : 0}};
    // Censé être utilisé avec expand (https://www.npmjs.com/package/expand) et ne peut pas etre utilisé si il y a des espaces dans le nom
    static ARGS_TMPL_EVT  = new Enum ({ POPULATE_DB_PROGRESS_EVT : "type:{type}#value:{value}#max_value:{max_value}#page:{page}"}) ;
    //if (EVENTS.get(POPULATE_DB_PROGRESS_EVT))

   /*
    static POPULATE_DB_PROGRESS_EVT_TMPL       = new Enum
    ({  'type' : '{type}',
        'value' : '{value}',
        'max_value' : '{max_value}',
        'page' : '{page}'
    })
    
 static ExtractArg_2 = ( expanded_tmpl, key_arg ) =>
    {
        var key_value_pairs = expanded_tmpl.split('#');
        for (const key_pair in key_value_pairs)
        {
            // "type:{type}#value:{value}#max_value:{max_value}#page:{page}"})
            // key_arg = 'type' et { type: 'Weapon', value:50,max_value:480,page:55} passé à expand()
            // key_pair = "type:Weapn" 
            var current_key     = key_pair.split(':')[0];
            var current_value   = key_pair.split(':')[1];  
            if (current_key == key_arg)
                return current_value;
        } // for
        return "NOTHING" //Konst.NOTHING;
    }
*/

    static ExtractArg = ( expanded_tmpl, key_arg ) =>
    {
        //console.log(expanded_tmpl);
        var key_value_pairs = expanded_tmpl.split('#');
        for (var i=0; i<key_value_pairs.length; i++)
        {   
            var key_pair = key_value_pairs[i];
            console.log(key_pair)
            // "type:{type}#value:{value}#max_value:{max_value}#page:{page}"})
            // key_arg = 'type' et { type: 'Weapon', value:50,max_value:480,page:55} passé à expand()
            // key_pair = "type:Weapn" 
            var current_key     = key_pair.split(':')[0];
            var current_value   = key_pair.split(':')[1];  
            if (current_key == key_arg)
                return current_value;
        } // for
        return "NOTHING" //Konst.NOTHING;
    } // ExtractArg


    static ExtractArgs = ( expanded_tmpl  ) =>
    {
        var extract_args_value = {};

        var keys = [];
        //---------- Extract keys ----------
        var key_value_pairs = expanded_tmpl.split('#');
        for (var i=0; i < key_value_pairs.length; i++)
        {   
            var key_pair = key_value_pairs[i];
            //console.log(key_pair)
            // "type:{type}#value:{value}#max_value:{max_value}#page:{page}"})
            // key_arg = 'type' et { type: 'Weapon', value:50,max_value:480,page:55} passé à expand()
            // key_pair = "type:Weapn" 
            var current_key     = key_pair.split(':')[0];
            keys.push( current_key ); 
        } // for
        //---------- Extract keys


        //---------- Fill "extract_args_value" with values  ----------
        var key_value_pairs = expanded_tmpl.split('#');
        for (var i=0; i < keys.length; i++)
        {   
            var key = keys[ i ];
            //console.log(key); 
            var current_value = GUI.ExtractArgByName( expanded_tmpl, key );
            extract_args_value[ key ] = current_value; 
        } // for
        //---------- Fill "extract_args_value" with values

        return extract_args_value;
    } // ExtractArgs


    static ExtractArgByName = ( expanded_tmpl, key_arg ) =>
    {
        //---------- Return extract_args_value ----------
        var key_value_pairs = expanded_tmpl.split('#');
        for (var i=0; i < key_value_pairs.length; i++)
        {   
            var key_pair = key_value_pairs[i];
            //console.log(key_pair)
            // "type:{type}#value:{value}#max_value:{max_value}#page:{page}"})
            // key_arg = 'type' et { type: 'Weapon', value:50,max_value:480,page:55} passé à expand()
            // key_pair = "type:Weapn" 
            var current_key     = key_pair.split(':')[0];
            var current_value   = key_pair.split(':')[1];  
            if (current_key == key_arg)
                return current_value;
        } // for
        //---------- Return extract_args_value

        return "NOTHING" //Konst.NOTHING;
    } // ExtractArgByName
} // GUI class

const test_1 = () =>
{
    var expanded_tmpl = expand( GUI.ARGS_TMPL_EVT.get(GUI.POPULATE_DB_PROGRESS_EVT).value, { 'type': 'Weapon', 'value':50,'max_value':480,'page':55});
    var type = GUI.ExtractArg(expanded_tmpl,'type');
    var value = GUI.ExtractArg(expanded_tmpl,'value');
    var max_value = GUI.ExtractArg(expanded_tmpl,'max_value');
    var page = GUI.ExtractArg(expanded_tmpl,'page');
    console.log( "test_1 - type:" + type + " value:" + value + " max_value:" + max_value + " page:" + page)
}

const test_2 = () =>
{
    var expanded_tmpl = expand( GUI.ARGS_TMPL_EVT.get(GUI.POPULATE_DB_PROGRESS_EVT).value, { 'type': 'Weapon', 'value':50,'max_value':480,'page':55});
    var args_value = GUI.ExtractArgs( expanded_tmpl );
    console.log( JSON.stringify( args_value ) );
    var type_value = args_value.type;
    console.log( "test_2 - type:" +  type_value );
}

test_1();
console.log("----------------------");
test_2();

exports.GUI = GUI;