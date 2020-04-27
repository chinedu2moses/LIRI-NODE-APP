require("dotenv").config();

//Create a variable to access the keys.js file(which is in the same root directory) to access the API keys that are in the file
//Creating variables for the required packages (node-spotify, axios, fs for read/write and moment to convert)
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

//Variable for the arguments to be entered by the user in LIRI
var appCommand = process.argv[2];
//console.log("appCommand: " + appCommand);
//Use the slice method to account for user's search starting with index 3 position 
var userSearch = process.argv.slice(3).join(" ");
//console.log("userSearch " + userSearch);
//Using switch statement to execute the code appropriate to the appcommand that is inputed from the user
function liriRun(appCommand, userSearch) {
    switch (appCommand) {
        case "spotify-this-song":
            getSpotify(userSearch);
            break;

        case "concert-this":
            getBandsInTown(userSearch);
            break; 

        case "movie-this":
            getOMDB(userSearch);
            break;
        
        case "do-what-it-says":
            getRandom();
            break;
        // If appCommand is left blank, return a default message to user
        default:
            console.log("Please enter one of the following commands: 'concert-this', 'spotify-this-song', 'movie-this'");

    };
};

//--------------Function to search Spotify API

function getSpotify(songName) {
    //Variables for the secret ids for spotify
    var spotify = new Spotify(keys.spotify);
    //console.log("spotify key: " + spotify)

    if (!songName) {
        songName = "The Sign";
    };
    //console.log("SongName if not a song name: " + songName)

    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        };

        //console.log("Data for searched song: " + data.tracks.items[0]);
        //adding a line break for clearity of when search result begin
        console.log("===============================");
        //return Artist(s)
        console.log("Artist(s) Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");
        //return The song's name
        console.log("Song Name: " + data.tracks.items[0].name + "\r\n");
        //return a preview link of the song from spotify
        console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");
        //return The album that the song is from
        console.log("Album: " + data.tracks.items[0].album.name + "\r\n");

        // Append text into log.txt file
        var logSong = "======Begin Spotify Log Entry======" + "\nArtist: " + data.tracks.items[0].album.artists[0].name + "\r\n";

        fs.appendFile("log.txt", logSong, function (err){
            if (err) throw err;
        });
        //logResults(data)
    });
};

//--------Funtion to search Bands In Town API
function getBandsInTown(artist) {
          
            var artist = userSearch;
            var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

            axios.get(bandQueryURL).then(
                function( response) {
                //adding a line break for clearity of when search results begin
                console.log("=============================");
                //console.log(Response);
                console.log("Name of the vanue: " + response.data[0].venue.name + "\r\n");
                console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
                console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");

                // Append text into log.txt file
                var logConcert = "======Begin Concert Log Entry======" + "\nName of the musician: " + artist + "\nName of the venue:";
                fs.appendFile("log.txt", logConcert, function (err){
                    if (err) throw err;
                });
                 //logResults(response)

            });
    };

//--------Function to search OMDB API
function getOMDB(movie) {
       //  console.log("movie: " + movie);
      // if the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
      if (!movie) {
          movie = "Mr. Nobody";
      }
      var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
      //console.log(movieQueryUrl);

      axios.request(movieQueryUrl).then(
          function (response) {
           // console.log(response.data)
           // adding a line break for clearity of when search result begin
           console.log("=============================");
           console.log("* Title: " + response.data.Title + "\r\n");
           console.log("* Year Released: " + response.data.Year + "\r\n");
           console.log("* IMDB Rating: " + response.data.imdbRating + "\r\n");
           console.log("* Rotten Tomatoes Rating: " + response.data.Ratings[1].value + "\r\n");
           console.log("* Country Where Produced: " + response.data.Country + "\r\n");
           console.log("* Language: " + response.data.Language + "\r\n");
           console.log("* Plot: " + response.data.Plot + "\r\n");
           console.log("* Actors: " + response.data.Actors + "\r\n");
           
           //logResults(response);
           var logMovie = "=======Begin Movie Log Entry======" + "\nMovie title: " + response.data.Title + "\nYear released:";

           fs.appendFile("log.txt", logMovie, function (err) {
               if (err) throw err;
           });
      
         });
};

//Using the fs Node package. Liri will take the text inside of random.txt and then use it to call one of LIRI'S command
// FUNCTION RANDOM
function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);

        } else {
            console.log(data);

            var randomData = data.split(",");
            liriRun(randomData[0], randomData[1]);
        }
        //console.log("\r\n" + "testing: " + randomData[0] + randomData[1]);
    });
};

//FUNCTION to log results from other functions
function logResults(data) {
    fs.appendFile("log.txt", data, function (err){
        if (err) throw err;
    });
};


liriRun(appCommand, userSearch);
