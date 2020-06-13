const konsole   = require("./bb_log.js").konsole;
const LOG_LEVEL = require("./bb_log.js").LOG_LEVEL;


// https://stackoverflow.com/questions/44740423/create-json-string-from-js-map-and-string
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
        konsole.log("utility.pause("  + delay_msec/1000 + " sec ) finished", LOG_LEVEL.PAUSE);
    }
    
    // stop for sometime if needed
    setTimeout(cb, delay_msec);
} // pause

  

exports.mapToObj    = mapToObj;
exports.mapToJSON   = mapToJSON;
exports.mapToString = mapToString;
exports.pause       = pause;