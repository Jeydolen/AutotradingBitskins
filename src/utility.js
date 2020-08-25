// https://stackoverflow.com/questions/44740423/create-json-string-from-js-map-and-string
const objToString = (obj) =>
{
    let str = '';
    for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}; // objToString()


const mapToObj = ( map_arg ) =>
{
    let obj = {};

    if ( map_arg.constructor.name == "Map" )
        map_arg.forEach( 
            (v,k) =>
                { 
                    //console.log ( 'v.constructor.name : ' + v.constructor.name + ' k ' + k);

                    if ( v.constructor.name == "Map" )
                        obj[k] = mapToObj( v );
                    else if ( v.constructor.name == "Array" )
                        obj[k] = arrayToObj( v );
                    else
                        obj[k] = v;
                });
    else
    {
        //console.log( " mapToObj is a " +  map_arg.constructor.name );
        obj = map_arg;
    }

    return obj
}; // mapToObj()


const arrayToObj = ( array_arg ) =>
{
    let obj = [];
    if ( array_arg.constructor.name == "Array" )
        obj = array_arg;
    return obj;
}; // mapToObj()


const objToJSON = ( obj_arg ) =>
{
    console.log ('objToJSON ! obj_arg is :' + obj_arg.constructor.name + "\n" + JSON.stringify( obj_arg ));
    let json_obj = null;
    if ( obj_arg.constructor.name == "Map" )
    {
        json_obj = {};
        json_obj.map = mapToObj( obj_arg );
    }
    else if ( obj_arg.constructor.name == "Array" )
        json_obj = arrayToObj( obj_arg );
    return json_obj;
}; // objToJSON()


const mapToJSON = ( obj_arg ) =>
{
    //console.log ('mapToJSON ! map_arg is :' + obj_arg.constructor.name + "\n" + JSON.stringify( obj_arg ));
    let json_obj = null;
    if ( obj_arg.constructor.name == "Map" )
    {
        json_obj = {};
        json_obj.map = mapToObj( obj_arg );
    }
    else if ( obj_arg.constructor.name == "Array" )
        json_obj = arrayToObj( obj_arg );
    else if ( obj_arg.constructor.name == "Object" )
        json_obj = obj_arg;
    else if ( obj_arg.constructor.name == "String" )
        json_obj = obj_arg;

    return json_obj;
}; // mapToJSON()


const mapToString = (map) =>
{
    let json_obj = mapToJSON(map);
    let json_str = JSON.stringify(json_obj);
    return json_str;
}; // mapToString()


const getFunctionName = (f) =>
{
    let ret = f.toString();
    ret = ret.substr('function '.length);
    ret = ret.substr(0, ret.indexOf('('));
    return ret;
}; // getFunctionName()


const replaceByValue = ( json, field, oldvalue, newvalue ) =>
{
    for( var k = 0; k < json.length; ++k ) 
    {
        json[k][field] = (newvalue *1)+k;
    }
    return json;
}


exports.objToString         = objToString;
exports.objToJSON           = objToJSON;
exports.mapToObj            = mapToObj;
exports.mapToJSON           = mapToJSON;
exports.mapToString         = mapToString;
exports.getFunctionName     = getFunctionName ;
exports.replaceByValue      = replaceByValue ;