const fs = require('fs');

// log_data takes a string of text and appends data to the history.log file.
// This function logs all the tweets, omdb, and spotify information to the log file
// The function is imported in to each of the command modules and called after the data has been logged to the screen.
function log_data(textToLog) {
	fs.appendFile("./history.log", textToLog, (error, data) => {
		// Kill the process if there is an error when writing to history.log
		if (error) throw Error("Something went wrong while logging data.")
	});
}

// log_command is imported in the entry file (../liri.js) It is called before the switch statment
function log_command(arguments) {
	// assign arguments from command line to variables
	let command = arguments[2];
	let value = arguments[3];

	// Convert the commands to a decorated string of text
	let logCommandText = `\n*** Command: ${command} | Value: ${value} ***\n`
	
	// Append to the log file;
	fs.appendFile("./history.log", logCommandText, (error, data) => {
		if (error) throw Error("Something went wrong while logging history.")
	});
}

// Export both functions
module.exports = {
	log_data: log_data,
	log_command: log_command
};