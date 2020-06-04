'use strict';

const request = require('request');
const host = 'https://covid19-brazil-api.now.sh';

async function count(path){

  // fetch all data from covid api
  const statesData = await fetchDataFromCovidAPI();

  // countData is a merge of all the data
  const countData =  calculateTotalData();

  // fetch the data inside the api
  async function fetchDataFromCovidAPI(){
    try{
      const res = await doRequestInCovidAPI(path);
      const data = transformDataInJsonFormat(res).data;

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
  function doRequestInCovidAPI(path){
    const url = host + '/' + path; // use a path in host api url
  
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

  // calcule the merge of all states
  function calculateTotalData(){
    let totalDeaths = 0;
    let totalCases = 0;


    for(let i = 0; i < statesData.length; i++){
      totalDeaths += statesData[i].deaths;
      totalCases += statesData[i].cases;
    }

    return {
      deaths: totalDeaths,
      cases: totalCases
    }
  }

  return countData;
}


module.exports = {count};
