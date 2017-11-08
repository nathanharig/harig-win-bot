var twit = require('twit');
var config = require ('./.config.js');
var Twitter = new twit(config);


var mySearch = function(){
  rtTerms = ['win tickets rt', 'win tix rt' , 'win pair rt', '#WinItWednesday' , '#FreebieFriday']
  var currentDate = new Date(Date.now());
  var formatDate = currentDate.toUTCString();
  console.log(`Current Date is ${formatDate}`);
  for (var i in rtTerms)
  {
    var params =rtTerms[i];
    //  retweet(params)
    retweet(params)
  }
}

var retweet = function(params) {
  var params = {
    q: params,
    result_type: 'recent',
    lang: 'en',
    geocode:'40.2,-77.2,500mi'
  }

  Twitter.get('search/tweets', params, function(err, data) {
    // if there no errors



      if (!err && data.statuses[0].retweeted_status != null) {

        // grab ID of tweet to retweet

        var retweetId = data.statuses[0].retweeted_status.id_str;
        var screenName = data.statuses[0].retweeted_status.user.screen_name;
        var notRetweet = data.statuses[0].retweeted_status;
        var tweet = data.statuses[0];
        if (screenName != 'NathanWinsStuff'){
          // Tell TWITTER to retweet
          Twitter.post('statuses/retweet/:id', {
            id: retweetId
          }, function(err, response) {
            if (response) {

              //  console.log(`Retweeted ${screenName} saying ${tweet.text}`);

              followUser(screenName, tweet.retweeted_status.text, params);
            }
            // if there was an error while tweeting
            if (err) {
              //    console.log('Something went wrong while RETWEETING... Duplication maybe...');
            }
          });

        }

      }

      // if unable to Search a tweet
      else {
        //    console.log('Something went wrong while SEARCHING...');
      }


  });
}

var followUser = function (screenName,retweeted, params)
{
  Twitter.post('friendships/create',
  { screen_name: screenName,
    follow: "true"
  }, function (err, resp) {
    if (err) {
      return console.log('friendship gave error: ' + JSON.stringify(err));
    }
    console.log(`\n Param- ${params.q} \n ||||  ${resp.following} status following ${resp.screen_name} \n ||| for  ${retweeted} \n || \n `);
  });
}

mySearch();
setInterval(mySearch, 60000);
