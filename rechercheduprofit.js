const fs = require('fs');
const https = require('https');
const request = require('request');



const totp = require('notp').totp;
const base32 = require('thirty-two');

const secretBitskins = "ZW3LWWCSRIAVMVNR";
const api_key = "3c75df64-c4c1-4066-8e65-34de828dd08e";
var _2FA_CODE =  totp.gen(base32.decode(secretBitskins));


var jsonData = "";


var query = "https://bitskins.com/api/v1/get_inventory_on_sale/?api_key=" + api_key + "&app_id=730&code=" +_2FA_CODE + "&is_souvenir=-1&per_page=480&show_trade_delayed_items=1"

///// https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js

function downloadPage(url) {
  return new Promise((resolve, reject) => {
      request(url, (error, response, body) => {
          if (error) reject(error);
          if (response.statusCode != 200) {
              reject('Invalid status code <' + response.statusCode + '>');
          }
          resolve(body);
      });
  });
}
// now to program the "usual" way
// all you need to do is use async functions and await
// for functions returning promises
async function myBackEndLogic() {
  try {
      const JSONData = await downloadPage(query)
      console.log('SHOULD WORK:');
      console.log(JSONData);
      fs.writeFile ("response.json", JSONData, function(err, result)
      {
        if(err) console.log('error', err);
      });
    

  } catch (error) {
      console.error('ERROR:');
      console.error(error);
  }
}
// run your async function
myBackEndLogic();
///// https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js