#! /usr/bin/env node
 // Require the .env file with access tokens
require('dotenv').config();
// ---- OMDB ----
const omdb = require('./commands/omdb');
// ---- TWITTER ----
const twitter = require('./commands/twitter');
// ---- SPOTIFY ----
const spotify = require('./commands/spotify');
// ---- DO WHAT IS SAYS ----
const doWhatItSays = require('./commands/do-what-it-says');
// ---- HELP INFO ----
const help = require('./commands/help');
// ---- COMMANDS/LOGGER/OPTIONS ----
// Require only log_command from logger module
const {log_command} = require('./commands/logger');
let command = process.argv[2];

// Set process index 3 to undefined if --say is passed before the any command, or without a command. This will ensure the user sees the help docs and not kill the node process.
let handle_song_movie = process.argv[3] === "--say" ? undefined : process.argv[3];
let options = {
	say: false
};

// IIFE that looks for --say to be passed as the fourth index item after with the movie command
(function (arguments) {
	arguments.find((item, index) => {
		if (command === 'movie' && index === 4 && item === '--say') {
			options.say = true;
		}
	});
}(process.argv));

// Log the command to history.log
log_command(process.argv);

// Call a command/function based on the command entered on the command line.
// The default case displays the help docs.
switch (command) {
	case ('tweets'):
		twitter(handle_song_movie, options);
		break;
	case ('spotify'):
		spotify(handle_song_movie, options);
		break;
	case ('movie'):
		omdb(handle_song_movie, options);
		break;
	case ('do-what-it-says'):
		doWhatItSays(handle_song_movie, options);
		break;
	default:
		help();
		break;
}