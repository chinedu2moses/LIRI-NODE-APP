const colors = require('colors');
const theme = require("./colors_theme");

colors.setTheme(theme);

function help() {
	// Help title
	console.log("\nENTER VALID COMMAND\n".help_title);
	// DO WHAT IT SAYS
	console.log("do-what-it-says".dowhatitsays);
	console.log("usage: do-what-it-says");
	console.log("Executes the command saved in ./commands/random.txt".data);
	console.log("----------------------------------------------------------------------------------\n".white);
	// OMDB
	console.log("movie".omdb);
	console.log("usage: movie " + "\"<movie title>\"\n".data);
	console.log("<movie title>".white + " - Song to movie in OMDB DB. Default is 'Mr. Nobody.' Title must be enclosed in quotation marks.".data);
	console.log("----------------------------------------------------------------------------------\n".white);
	// SPOTIFY
	console.log("spotify".spotify);
	console.log("usage: spotify " + "\"<song title>\"\n".data);
	console.log("<song title>".white + " - Song to search in Spotify. Default is 'I Want it That Way.' Song title must be enclosed in quotation marks.".data);
	console.log("----------------------------------------------------------------------------------\n".white);
	// TWITTER 
	console.log("tweets".tweets);
	console.log("usage: tweets " + "<handle> [--#]\n".data);
	console.log("<handle>".white + " - Pull tweets from a different user. Default is @barackobama. (optional)".data);
	console.log("[--#]".white + " - Set number of tweets. Default is 20. (optional)".data);
	console.log("----------------------------------------------------------------------------------\n".white);

}

module.exports = help;