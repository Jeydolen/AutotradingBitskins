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
  
/*
var myMap = new Map();
myMap.set("key1", "value1");
myMap.set("key2", "value2");
myMap.set("key3", "value3");
  
var myString = "string value"
  
var myJson = {};
myJson.myMap = mapToObj(myMap);
myJson.myString = myString;
var json = JSON.stringify(myJson);
  
console.log(json):
*/

exports.mapToObj    = mapToObj;
exports.mapToJSON   = mapToJSON;
exports.mapToString = mapToString;