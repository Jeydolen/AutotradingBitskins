const rechercheduprofit = require('./rechercheduprofit.js');

//https://javascript.info/task/async-from-regular
var obj = null;
rechercheduprofit.myBackEndLogic().then(result => obj = result);
console.log(obj);