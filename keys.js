//console.log("this is loaded");

//Targetingthe secret IDs for spotify from the .env file and exporting them so liri.js file can access them.
//Keeps my API authentication information hidden by having them stored and accessed from my .env file.
exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

