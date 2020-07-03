// https://stackoverflow.com/questions/44740423/create-json-string-from-js-map-and-string
const objToString = (obj) =>
{
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}; // objToString()

const mapToObj = (map) =>
{
    var obj = {}
    map.forEach(function(v, k){
      obj[k] = v
    })
    return obj
}; // mapToObj()

const mapToJSON = (map) =>
{
    var json_obj = {};
    json_obj.map = mapToObj(map);
    return json_obj;
}; // mapToJSON()

const mapToString = (map) =>
{
    var json_obj = mapToJSON(map);
    var json_str = JSON.stringify(json_obj);
    return json_str;
}; // mapToString()

const pause = (delay_msec) =>
{
    const cb = () => 
    {
        // your code to run after the timeout
        console.log("utility.pause("  + delay_msec/1000 + " sec ) finished");
    }
    
    // stop for sometime if needed
    setTimeout(cb, delay_msec);
} // pause

  
exports.objToString = objToString;
exports.mapToObj    = mapToObj;
exports.mapToJSON   = mapToJSON;
exports.mapToString = mapToString;
exports.pause       = pause;