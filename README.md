# Harig-Win-Bot
This is a bot that I made in node.js to play around with searching twitter for common giveaway phrases, retweeting those original tweets, and following the original tweeter.

If you are interested in using this bot

1) Clone the repository to your local computer (you will need at least node.js 8 installed to use this code.
2) Run npm install in the local directory.
3) Create an app on apps.twitter.com
4) Create a new local file in the base bot directory, titled .config.js, which contains the following (consumer keys & access tokens come from apps.twitter.com):
	 ```
	 module.exports = {
	   consumer_key: 'YOUR-TWITTER-KEY-HERE',
	   consumer_secret: 'YOUR-TWITTER-SECRET-HERE',
	   access_token: 'YOUR-TWITTER-ACCESS-TOKEN-HERE',
	   access_token_secret: 'YOUR-TWITTER-TOKEN-SECRET-HERE'
	}
	```
5) Launch the node command line, navigate to the directory, and type in npm start. Voila, you should be working!

Tips:

1) Terms can be edited in the mySearch function of bot.js. Edit any item in the array rtTerms and send you geo parameters to the function retweet.  Only the first result (most recent) from each field is tweeted. To change the interval, edit the setInterval at the bottom bot.js, time is in miliseocnds.
2) The bot has a built in check to make sure it's not tweeting old links. This check is in the bot.js recentDatesOnly function and returns a value, currently checking to make sure that a status isn't more than 4 days old.
3) The bot also is geo limited to check around a 500 mile radius from Carlisle, PA- my hometown. You can edit this in the retweet function by modifying geocode params as a string that follows the format 'lat,lon,radius' but be sure to include either mi or km at the end of radius so that your function actually works.
4) Bot.js includes a "blockList" function that hides users you don't want to retweet. By default, this includes my test account, my personal account, and an annoying giveaway site. Edit the array by adding whomever you'd like. These tweets will not be retweeted or followed.
5) The Bot now includes an unfollow/delete status function that ones initially and again eveyr week. This helps keep follows trim and your tweets from being too obnoxious.

Thanks for checking this out!
