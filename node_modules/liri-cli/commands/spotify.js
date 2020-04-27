//Require Spotify module
const Spotify = require('node-spotify-api');

// Require propercase module. This will convert the artists and titles to propercase.
const propercase = require('propercase');

// Require only the log data function
const {log_data} = require('./logger');

// Require and set the colors theme
const colors = require("colors");
const theme = require("./colors_theme");
colors.setTheme(theme);

// Create a new Spotify object
let spotify = new Spotify({
	id: process.env.SPOTIFY_CLIENT_ID,
	secret: process.env.SPOTIFY_CLIENT_SECRET
});

// Default settings incase user does not enter a song title
let searchSettings = {
	type: 'track',
	query: 'Ace of Base The Sign',
	limit: 3
}

// Using async/await to make request. Using async/await:
// 1) I feel the code is much cleaner
// 2) will not return undefined to liri.js before the call completes, while not blocking other code
async function getTracks(song_title) {

	// Overwrite the default song title if user passes a title as a command line arguement
	if (song_title) {
		searchSettings.query = song_title;
	}

	// The tracks returned from Spotify API
	var tracks = await spotify.search(searchSettings);

	// Process each of the tracks returned from the response. 
	return processTracks(tracks);
}

// The function to process each of the tracks returned from Spotify. Used much like a .then() call in a promise
function processTracks(response) {
	// Store track list in an array
	var tracksResponseArray = response.tracks.items;
	// Get number of tracks in the response
	var numTracks = tracksResponseArray.length;

	// Dp the following If the number of tracks is 1 or more.
	if (numTracks > 0) {
		//Map over each track, store necessary data to variables and log to terminal and history.log
		tracksResponseArray.map(trackInfo => {
			var artist_name = propercase(trackInfo.artists[0].name);
			var song_title = trackInfo.name;
			var album_title = trackInfo.album.name;
			var preview_link = trackInfo.preview_url ? trackInfo.preview_url : "Preview not available".error;

			console.log(`\nArtist:`.spotify, `${artist_name}`.white);
			console.log(`Song:`.spotify, `${song_title}`.white);
			console.log(`Album:`.spotify, `${album_title}`.white);
			console.log(`URL:`, `${preview_link}`.spotify.underline);
			console.log("\n--------------------------------------\n");
			
			log_data(`\nArtist: ${artist_name}\nSong: ${song_title}\nAlbum:${album_title}\nURL: ${preview_link}\n\n-------------------\n`);

		});
	} else {
		// If 0 tracks returned log to terminal and history.log
		console.log("Could not find any tracks with this title.".error);
		log_data(`\nCould not find any tracks with this title.\n\n-------------------\n`);
	}

}

// Export getTracks function for use in ../liri.js
module.exports = getTracks;