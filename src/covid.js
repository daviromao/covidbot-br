'use strict';

const request = require('request');
const host = 'https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/';
const path = 'prod/PortalCasos';

async function get(){

  // fetch all data from covid api
  const data = await fetchDataFromCovidAPI();
  const daysData = data.dias;

  return daysData;
  
  // fetch the data inside the api
  async function fetchDataFromCovidAPI(){
    try{
      const res = await doRequestInCovidAPI('');
      const data = transformDataInJsonFormat(res);
      
      return data;
    } catch (e) {
      
      console.log(e);
    }
  }

  // transform the data format from web in json format
  function transformDataInJsonFormat(data){
    const json = JSON.parse(data);
    return json;
  }

  // create a promise of request in covid api
  function doRequestInCovidAPI(){
    const url = host + path; // use a path in host api url
  
    return new Promise( (resolve, reject) => {
      request(url, (error, res, body) => {
        if(!error && res.statusCode == 200){
          
          resolve(body)
        }else{
          reject(error);
        }
  
      });
    });
  }
}

get();

module.exports = {get};
