// Require the file system module to read the random.txt file
const fs = require('fs');
// Import the colors module
const colors = require("colors");
// Import and set the custom theme used for all modules
const theme = require("./colors_theme");
colors.setTheme(theme);

// Store each of the commands in an object named commands. This will be used to call each function/command passed in from the command line
const commands = {
	help: require('./help'),
	movie: require('./omdb'),
	spotify: require('./spotify'),
	tweets: require('./twitter'),
}

// The function to export
function doWhatItSays() {
	// Asynchronously read the file random.txt. Throw error if file does not exist 
	fs.readFile('./commands/random.txt', (error, data) => {
		if (error) {
			throw error
		};

		// Data is an buffer. Conver to string and split on the comma to create an array
		var randomTxt = data.toString().split(',');
		// the command is index 0
		var command = randomTxt[0];
		// the argument is index 1
		var handle_song_movie = randomTxt[1];

		// Each command is a function. If the the command is not a valid value, display the help info
		if (typeof commands[command] === 'function') {
			commands[command](handle_song_movie);
		} else {
			commands.help();
		}

	});
}

// Export the function.
module.exports = doWhatItSays;