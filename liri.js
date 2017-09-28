var tweeterkeys = require('./tweeterkeys.js');
var spotifykeys = require('./spotifykeys.js');

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var command = process.argv[2];
var name = process.argv[3];

function choose(command, name){
  switch (command) {
    case "movie-this":
      request("http://www.omdbapi.com/?t=name&plot=short&apikey=40e9cece", function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log(JSON.parse(body));
          console.log("\n ********************************\n");
          console.log("The movie's name is: " + name);
          console.log("Rating: " + JSON.parse(body).imdbRating);
          console.log("Released date: " + JSON.parse(body).Released);
          console.log("Genre: " + JSON.parse(body).Genre);
        }
      });
      break;

    case "spotify-this-song":
      // var spotify = new Spotify(spotifykeys);
      var spotify = new Spotify({
        id: 'e32a2682bd494d8880b914ca4a9a4191',
        secret: 'd2340a452a3f409f9c9ce0361918a125'
      });

      spotify.search({ type: 'track', query: name }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
        var artist = data.tracks.items[0].album.artists[0].name;
        console.log(artist);
        console.log('Album: ', data.tracks.items[0].album);
        console.log('A preview link of the song from Spotify: ',data.tracks.items[0].album.href);
        console.log('Artist name: ', data.tracks.items[0].album.artists[0].name);
        console.log('Song name: ' + name);
    });
      break;

    case "do-what-it-says":
      fs.readFile('random.txt','utf-8', function(err, data){
        name = data.split(',')[1];
        command = "spotify-this-song";
        choose(command, name);
      });
      break;

    case "my-tweets":
      var Twit = new Twitter(tweeterkeys);
      var params = {
        screen_name: 'sh_Liri',
        count: 2
      };
      Twit.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
          var result = JSON.parse(response.body);
          for(var i=0;i<2; i++){
            console.log(i+'_tweet craeted at: ' + result[i].created_at);
              console.log(i+'_tweet text: ' + result[i].text.split('.')[0]);
          }
        }else{
          console.log(error);
        }
      });

  }
}

choose(command,name);
