var twit = require('twit');
var config = require ('./.config.js');
var Twitter = new twit(config);
var lastOne = new String();


var mySearch = function(){
  rtTerms = ['win tickets rt', 'win tix rt' , 'win pair rt', '#WinItWednesday' , '#FreebieFriday']
  var currentDate = new Date(Date.now());
  var formatDate = currentDate.toUTCString();
  console.log(`####### MySearch /// Current Date is ${formatDate} /// #######`);
  for (var i in rtTerms)
  {
    var params =rtTerms[i];
    //  retweet(params)
    retweet(params,'40.2,-77.2,200mi')
  }
  //console.log('mySearch Complete');
}

var recentDatesOnly = function(statusDate){
  var currentDate = new Date(Date.now() - 345600000);
  var checkDate = new Date(statusDate);
  var isCurrent = false;
  if (checkDate >= currentDate)
  {
    isCurrent = true;
  }
  // console.log('recentDatesOnly Complete');
  return isCurrent;
}

var blockList = function(screenName){
  var blocked = ['NathanWinsStuff', 'nathanharig', 'your_home', 'TempleEDM', 'HoneyBunnyTV'];
  var check = true;
  for (i in blocked) {
    if (blocked[i] === screenName) {
      check = false;
    }
  }
//  console.log('blockList Complete');
  return check;
}

var retweet = function(params, geo) {
  var params = {
    q: params,
    result_type: 'recent',
    lang: 'en',
    geocode: geo,
  }

  Twitter.get('search/tweets', params, function(err, data) {
    try {
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
    }
    catch(e) {
      console.log(`${data.statuses[0]} and \n ${e}`);
    }
  });

//console.log('retweet Complete');
}

var mySearch2 = function(){
  rtTerms = ['win xbox rt', '"win an iphone"' , 'win airfare rt', '#Giveaway' , '#Sweepstakes']
  var currentDate = new Date(Date.now());
  var formatDate = currentDate.toUTCString();
  console.log(`####### MySearch 2 /// Current Date is ${formatDate} /// #######`);
  for (var i in rtTerms)
  {
    var params =rtTerms[i];
    //  retweet(params)
    retweet(params,'39.8283,-98.5795,2200km')
  }
//  console.log('mySearch2 Complete');
}

var followUser = function (screenName, retweeted, params)
{
  var formatText = new String(retweeted.text);
  var someText = formatText.replace(/(\r\n|\n|\r)/gm,"");
  Twitter.post('friendships/create',
  { screen_name: screenName,
    follow: "true"
  }, function (err, resp) {
    if (err) {

      return console.log(`~~~ ERROR with ${screenName} ~~~ \n // attempted retweet of ${someText} from ${retweeted.created_at} // \n !!!! error message = ${err} !!!! \n`);
    }
    console.log(`\n ||||| Param- ${params.q} \n ||||  ${resp.following} status following ${resp.screen_name} \n ||| for  ${someText} \n || originally sent ${retweeted.created_at} \n  `);
  });
//  console.log('followUser Complete');
}

var oneWeekTweets = function(statusDate){
  var currentDate = new Date(Date.now() - 604800000);
  var checkDate = new Date(statusDate);
  var isCurrent = false;
  if (checkDate >= currentDate)
  {
    isCurrent = true;
  }
//  console.log('oneWeekTweets Complete');
  return isCurrent;
}

var unFollowCheck = function (sinceID) {
  var followedTweets = [];
  if (!sinceID) {

    Twitter.get('statuses/user_timeline', {
      screen_name: 'NathanWinsStuff',
      count: 200 } , function (err, resp) {
        if (!err) {

          for (i in resp)
          {
            followedTweets.push(resp[i]);
          }
          console.log(`@@@@ First Run - Checking start time- ${followedTweets[0].created_at} @@@@`);
          for (var i = 0; i<followedTweets.length - 1; i++)
          {
            var shorten = followedTweets[i].retweeted_status;
            var tweetID = followedTweets[i].id_str;
            try {
              var check = oneWeekTweets(shorten.created_at);
            }
            catch(e) {
              var check = false;
            }
          //  console.log(`Tweet created ${followedTweets[i].created_at} with status of ${check} at index ${i}`);
            doUnfollow(shorten, check);
            doDelete(tweetID, check);
            lastOne = followedTweets[followedTweets.length - 1];
          }


        }
        else {
          console.log(err);
        }
      //  console.log(`Complete with ${lastOne.id_str} and ${followedTweets.length}`);
        if (followedTweets.length > 1) {
          unFollowCheck(lastOne.id_str);
        }

      });


  }
  else {
    followedTweets = [];
    Twitter.get('statuses/user_timeline', {
      screen_name: 'NathanWinsStuff',
      count: 200,
      max_id: sinceID } , function (err, resp) {
        if (!err) {

          for (i in resp)
          {
            followedTweets.push(resp[i]);
          }
          console.log(`@@@@ Checking start time- ${followedTweets[0].created_at} @@@@`);
          for (var i = 0; i<followedTweets.length - 1; i++)
          {
            var shorten = followedTweets[i].retweeted_status;
            var tweetID = followedTweets[i].id_str;
            try {
              var check = oneWeekTweets(followedTweets[i].created_at);
            }
            catch(e) {
              var check = false;
            }
          //  console.log(`Tweet created ${followedTweets[i].created_at} with status of ${check} at index ${i}`);
            doUnfollow(shorten, check);
            doDelete(tweetID, check);
            lastOne = followedTweets[followedTweets.length - 1];
          }


        }
        else {
          console.log(err);
        }
        // console.log(`Complete with ${lastOne.id_str} and ${followedTweets.length}`);
        if (followedTweets.length > 1) {
          unFollowCheck(lastOne.id_str);
        }

      });

    }
//    console.log('unFollowCheck Complete');
  }

  var doUnfollow = function (shorten, check) {
    if (check != true) {
      Twitter.post('friendships/destroy', {
        screen_name: shorten.user.screen_name
      } , function (err, resp) {
        if (!err) {
          console.log(`Successfully unfollowed ${shorten.user.screen_name}`);
        }
        else {
          console.log(err);
        }
      });
    }
//    console.log('doUnfollow Complete');
  }

  var doDelete = function (tweetID, check){
    if (check!= true)
    {
      Twitter.post('statuses/destroy', {
        id: tweetID }, function (err, resp) {
          if (!err)
          {
            console.log(`Tweet Deleted (id) ${tweetID}`);
          }
          else {
            console.log(err);
          }
        });
      }
    //  console.log('doDelete Complete');
    }

    var getKeys = function(obj){
      var keys = [];
      for(var key in obj){
        keys.push(key);
      }
      console.log(keys);
    }

    mySearch();
    mySearch2();
    unFollowCheck();
    setInterval(unFollowCheck, 86400000);
    setInterval(mySearch, 150000);
    setInterval(mySearch2, 150000);
