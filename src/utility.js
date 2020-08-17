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


const mapToObj = (map) =>
{
    let obj = {}
    map.forEach( 
        (v,k) =>
            {
            if ( v.constructor.name == "Map" )
                obj[k] = mapToObj(v);
            else
                obj[k] = v;
            })

    return obj
}; // mapToObj()


const mapToJSON = (map) =>
{
    let json_obj = {};
    json_obj.map = mapToObj(map);
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


exports.objToString = objToString;
exports.mapToObj    = mapToObj;
exports.mapToJSON   = mapToJSON;
exports.mapToString = mapToString;
exports.getFunctionName = getFunctionName ;