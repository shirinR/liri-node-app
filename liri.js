var tweeterkeys = require('./tweeterkeys.js');
var spotifykeys = require('./spotifykeys.js');

var Twitter = require('twitter');
var spotify = require('spotify');
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
      spotifykeys.search({ type: 'artist OR album OR track', query: name }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }
      console.log(data); // TODO: { error: { status: 401, message: 'No token provided' } }
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
      tweeterkeys.get('favorites/list', function(error, tweets, response) {
        if(error) throw error;
        console.log(tweets);  // The favorites.
        console.log(response);  // Raw response object.
      });

  }
}
