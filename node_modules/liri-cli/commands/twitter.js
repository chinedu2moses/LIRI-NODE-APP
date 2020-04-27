// Require Twitter module
const Twitter = require('twitter');

// Require moment.js to format tweet dates
const moment = require("moment");

// Require the log_data function from logger module.
const {log_data} = require('./logger');

// Require/set colors theme 
const colors = require('colors');
const theme = require("./colors_theme");
colors.setTheme(theme);

// Create new Twitter object with API keys/tokens
let twitter = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Set default options for twitter requests
let params = {
	screen_name: 'barackobama',
	count: 20
};

// Using async/await to make request to Twiiter. Using async/await:
// 1) I feel the code is much cleaner
// 2) will not return undefined to liri.js before the call completes, while not blocking other code
async function getTweet(screenName) {
	if (screenName) {
		params.screen_name = screenName;
	}
	var tweets = await twitter.get('statuses/user_timeline', params);
	return processTweets(tweets);
}

// The function to process each of the tweets returned from Twitter response. Used much like a .then() call in a promise
function processTweets(tweets) {
	tweets.map(tweet => {
		// Store tweet info in variables
		var screen_name = tweet.user.screen_name;
		var tweet_text = tweet.text;
		var tweet_time = moment(new Date(tweet.created_at), 'YYYY-MM-DD hh:mm:ss');

		// Log tweet to the console
		console.log(`\n@${screen_name}:`.tweets, `${tweet_text}`.white);
		console.log(`Created: ${tweet_time}`.data);
		console.log("\n-------------------\n");
		
		// Log tweet to the history.log
		log_data(`\n@${screen_name}: ${tweet_text}\nCreated: ${tweet_time}\n\n-------------------\n`);
	});

}

module.exports = getTweet;