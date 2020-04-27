// Require the os module. Will use this to check if node is running in Darwin environment
const os = require('os');
// Require the child_process module's spawn method. Will execute the macOS say command
const spawn = require("child_process").spawn;
// Require the request module
const request = require('request');

// Require only the log_Data function from the logger module.
const {log_data} = require('./logger');

// Require and set colors theme
const colors = require('colors');
const theme = require("./colors_theme");
colors.setTheme(theme);

// Set default values for the OMDB requests
let omdb = {
	base: `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}`,
	type: 'movie',
	t: 'Mr. Nobody'
}

// omdbRequest takes a movie title and options object.
// options sets say to false as a default. This will be updated if/when user passed a --say argument and running node from macOS
function omdbRequest(movie_title, options = {
	say: false
}) {
	// Update the omdb options object with the movie title argument 
	if (movie_title) {
		omdb.t = movie_title;
	}

	// Encode the URL to be sent with each request to OMDB
	omdb.url = encodeURI(`${omdb.base}&type=${omdb.type}&t=${omdb.t}`);

	// Request movie information from OMDB
	request(omdb.url, function (error, response, body) {

		// Store each of the items we need from the response in a variable
		var body = JSON.parse(body);
		var os_platform = os.platform();
		var rule = "\n--------------------------------------\n";
		if (body.Response != 'False') {
			omdb.movie_title = body.Title;
			omdb.movie_year = body.Year;
			omdb.movie_ratings = body.Ratings;
			omdb.movie_country = body.Country;
			omdb.movie_language = body.Language;
			omdb.movie_director = body.Director;
			omdb.movie_actors = body.Actors;
			omdb.movie_plot = body.Plot;
			omdb.movie_ratings_obj = {};

			// Build an object from the ratings array in the response object
			buildRatingsObj(omdb.movie_ratings);

			// Log information to the terminal
			console.log(`\nTitle:`.omdb, `${omdb.movie_title}`.white);
			console.log(`Year:`.omdb, `${omdb.movie_year}`.white);
			console.log(`IMDB Rating:`.omdb, `${omdb.movie_ratings_obj.imdb}`.white);
			console.log(`Rotten Tomatoes Rating:`.omdb, `${omdb.movie_ratings_obj.rotten_tomatoes}`.white);
			console.log(`Country:`.omdb, `${omdb.movie_country}`.white);
			console.log(`Language:`.omdb, `${omdb.movie_language}`.white);
			console.log(`Director:`.omdb, `${omdb.movie_director}`.white);
			console.log(`Actors:`.omdb, `${omdb.movie_actors}`.white);
			console.log(`\nPlot:`.omdb, `${omdb.movie_plot}`.white);
			console.log(rule);

			// Log data to the history.log file
			log_data(`\nTitle: ${omdb.movie_title}\nYear: ${omdb.movie_year}\nIMDB Rating: ${omdb.movie_ratings_obj.imdb} Rotten Tomatoes Rating: ${omdb.movie_ratings_obj.rotten_tomatoes}\nCountry: ${omdb.movie_country}\nLanguage: ${omdb.movie_language}\nDirector: ${omdb.movie_director}\nActors: ${omdb.movie_actors}\n\nPlot: ${omdb.movie_plot}${rule}`);

			// if user passed --say option and running node from Darwin (macOS) then spawn the say process 
			if (options.say && os_platform === 'darwin') {
				say(options, `${omdb.movie_title}. ${omdb.movie_year}. ${omdb.movie_plot}`);
			}

		} else {
			// Log errors to the terminal and history.log
			console.log("Error:".error, "Movie not found!".white);
			log_data(`\nError: Movie not found!${rule}`);
		}

	});
}

// Function used to build an object of ratings from IMDB, Rotten Tomatoes and Metacritic.
// This is just for my own use and clarity when passing text to terminal and history.log
function buildRatingsObj(ratingsArray) {
	ratingsArray.map(item => {
		switch (item.Source) {
			case ('Internet Movie Database'):
				omdb.movie_ratings_obj.imdb = item.Value
				break;
			case ('Rotten Tomatoes'):
				omdb.movie_ratings_obj.rotten_tomatoes = item.Value
				break;
			case ('Metacritic'):
				omdb.movie_ratings_obj.metacritic = item.Value
				break;
		}
	});
}

// Function to double-check user is runngin macOS/Darwin and spawns 'say' process
function say(options, text) {
	var os_platform = os.platform();
	if (options.say && os_platform === 'darwin') {
		spawn('say', [text]);
	}
}

// Export to ../liri.js
module.exports = omdbRequest;