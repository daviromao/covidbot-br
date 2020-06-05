'use strict';

const dotenv = require('dotenv/config');
const sleep = require('sleep').sleep;

const config = require('./src/config');
const covid = require('./src/covid');

const Twitter = require('twitter');
const state = require('./src/state');

const T = new Twitter({
  consumer_key: process.env.APPLICATION_CONSUMER_KEY,
  consumer_secret: process.env.APPLICATION_CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

async function start(){
  const date = new Date();
  const stringDate = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;

  const dailydata = await covid.get();
  const content = state.readContent();

  for(let data of dailydata){
    if(content.includes(data._id)) continue;

    const tweet = createTweetStringFromData(data);
    
    await postTweet(tweet);
    sleep(2);

    content.push(data._id);
  }

  function createTweetStringFromData(data){
    const tweet = config.tweetModel
                  .replace('{newcases}', data.casosNovos)
                  .replace('{newdeaths}', data.obitosNovos)
                  .replace('{date}', data._id)
                  .replace('{cases}', data.casosAcumulado)
                  .replace('{deaths}', data.obitosAcumulado);

    return tweet;
  }

  state.save(content);
}



async function postTweet(tweet){
  try{

    const res = await T.post('statuses/update', {status: tweet});
    const newStatusLog = config.logModel
                        .replace('{date}', res.created_at)
                        .replace('{id}', res.id_str);

    console.log(newStatusLog);

  } catch (e){
    console.log(e);
  }
}

//info
console.log('Bot is on.');


// Loop interval to post at 12 o'Clock
setInterval(() => {
  const date = new Date();

  if(date.getHours() == 21 && date.getMinutes() == 0){
    start();
  }

}, 60000); // Repeat every 60000 milliseconds (1 minute)
