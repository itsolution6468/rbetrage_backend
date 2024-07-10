const axios = require("axios");

const BEARER_TOKEN = "YOUR_TWITTER_BEARER_TOKEN";

const twitterClient = axios.create({
  baseURL: "https://api.twitter.com/2",
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
});

module.exports = twitterClient;
