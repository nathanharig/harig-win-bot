var twit = require('twit');
var config = require ('./.config.js');
var Twitter = new twit(config);


var mySearch = function(){
  rtTerms = ['win tickets rt', 'win tix rt' , 'win pair rt', '#WinItWednesday' , '#FreebieFriday']
  var currentDate = new Date(Date.now());
  var formatDate = currentDate.toUTCString();
  console.log(`/// Current Date is ${formatDate} ///`);
  for (var i in rtTerms)
  {
    var params =rtTerms[i];
    //  retweet(params)
    retweet(params)
  }
}

var recentDatesOnly = function(statusDate){
  var currentDate = new Date(Date.now() - 345600000);
  var checkDate = new Date(statusDate);
  var isCurrent = false;
  if (checkDate >= currentDate)
  {
    isCurrent = true;
  }
  return isCurrent;
}

var blockList = function(screenName){
  var blocked = ['NathanWinsStuff', 'nathanharig', 'your_home'];
  var check = true;
  for (i in blocked) {
    if (blocked[i] === screenName) {
      check = false;
    }
  }
  return check;
}

var retweet = function(params) {
  var params = {
    q: params,
    result_type: 'recent',
    lang: 'en',
    geocode:'40.2,-77.2,500mi',
    }

  Twitter.get('search/tweets', params, function(err, data) {

      if (!err && data.statuses[0].retweeted_status != null) {
        var dated = recentDatesOnly(data.statuses[0].retweeted_status.created_at)
        var retweetId = data.statuses[0].retweeted_status.id_str;
        var screenName = data.statuses[0].retweeted_status.user.screen_name;
        var notRetweet = data.statuses[0].retweeted_status;
        var tweet = data.statuses[0];
        var blocking = blockList(screenName);

        if (blocking != false && dated != false){
          // Tell TWITTER to retweet
          Twitter.post('statuses/retweet/:id', {
            id: retweetId
          }, function(err, response) {
            if (response) {
              followUser(screenName, tweet.retweeted_status, params);
            }
            if (err) {

            }
          });
        }
      }
      else {
      }
  });
}

var followUser = function (screenName, retweeted, params)
{
  Twitter.post('friendships/create',
  { screen_name: screenName,
    follow: "true"
  }, function (err, resp) {
    if (err) {
      return console.log(`~~~ ERROR with ${screenName} ~~~ \n // attempted retweet of ${retweeted.text} from ${retweeted.created_at} // \n !!!! error message = ${err} !!!! \n`);
    }
    console.log(`\n ||||| Param- ${params.q} \n ||||  ${resp.following} status following ${resp.screen_name} \n ||| for  ${retweeted.text} \n || originally sent ${retweeted.created_at} \n  `);
  });
}

mySearch();
setInterval(mySearch, 1500000);
