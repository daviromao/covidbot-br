'use strict';

const dotenv = require('dotenv/config');
const sleep = require('sleep').sleep;

const model = require('./src/config').model;
const covid = require('./src/covid');

const Twitter = require('twitter');

const T = new Twitter({
  consumer_key: process.env.APPLICATION_CONSUMER_KEY,
  consumer_secret: process.env.APPLICATION_CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

async function start(){
  const date = new Date();
  const stringDate = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;

  const covidDataBrasil = await covid.count('api/report/v1');
  const tweet = model
              .replace('{date}', stringDate)
              .replace('{cases}', covidDataBrasil.cases)
              .replace('{deaths}', covidDataBrasil.deaths);

  postTweet(tweet);
}

async function postTweet(tweet){
  try{

    const res = await T.post('statuses/update', {status: tweet});
    console.log(`
    - New status -
    Date: ${res.created_at}
    ID: ${res.id_str}
    --------------
    `);

  } catch (e){
    console.log(e);
  }
}

// Loop interval to post at 12 o'Clock
setInterval(() => {
  const date = new Date();

  if(date.getHours() == 12 && date.getMinutes() == 00){
    start();
  }

}, 60000); // Repeat every 60000 milliseconds (1 minute)