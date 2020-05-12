const request    = require('request');
const totp       = require('notp').totp;
const base32     = require('thirty-two');

const SECRET_BITSKINS = "ZW3LWWCSRIAVMVNR";
const API_KEY         = "3c75df64-c4c1-4066-8e65-34de828dd08e";


var result   = null;

const buildQuery = function (page_index)
{

  var   two_FA_code      =  totp.gen(base32.decode(SECRET_BITSKINS));
  var query    = "https://bitskins.com/api/v1/get_inventory_on_sale/?api_key=" + API_KEY + "&app_id=730&code="
                + two_FA_code + "&is_souvenir=-1&per_page=480&show_trade_delayed_items=1&page=" + page_index ;
  return query;
}; // buildQuery
			  

///// https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js
const downloadPage = function (url, on_response_ready) 
{
  var result =  new Promise((resolve, reject) => 
  {
      request(url, (error, response, body) => 
      {
          if (error) reject(error);
          if (response != undefined && response.statusCode != 200)
          {
              reject('Invalid status code <' + response.statusCode + '>');
          }
          else
          {
            on_response_ready(body);
          }
          resolve(body);
      });
  });
  return result;
}; // downloadPage()

const onError = function(err, result)
{
  if (err) console.log('error', err);
};

const fetchItems = async function(page_index, on_response_ready) 
{
  try 
  {
      result = await downloadPage(buildQuery(page_index), on_response_ready)
    //  console.log('SHOULD WORK:');
      // console.log (result);
  } 
  catch (error) 
  {
      console.error('ERROR:');
      console.error("error: " + error);
      result = error;
  }
}; // fetchItems


exports.fetchItems = fetchItems;
///// https://stackoverflow.com/questions/8775262/synchronous-requests-in-node-js