
//Begin

// Import the express, the express-session and passport modules
const express = require('express');
const session = require('express-session');
const passport = require('passport');



// Define the Api Key:
const apiKey = 'AIzaSyBK1st4o-7-leGvUqgKfwGOwrS46GGtq8E';

// Import The Google Apis
const {google} = require('googleapis');

// Variables Youtube googleapis
const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
});

// Function to retrieve the rating of a video

async function getVideoRating(videoId) {
    try {
        // Call the youtube.videos.list method to retrieve the rating of a video
        const response = await youtube.videos.getRating(
            {part: 'id, rating', id: videoId}
        );
        // Return the rating of the video
        const rating = response.data.items[0].rating;
        console.log(rating);

    } catch (error) {
        console.log(error);
    }
}

getVideoRating('M7lc1UVf-VE');

// https://www.googleapis.com/youtube/v3/getRating/?key=apiKey&videoId=videoId
// https://www.googleapis.com/youtube/v3/search/?key=apiKey&part=snippet&maxResults=25&q=videoId


// Bring back the passport config
require('./auth');

// Bring back the routes
const routes = require('/endpoints');


// Create an express app & initialize passport and session
const app = express(routes);
app.use(session({ secret: 'Fragsy' }));
app.use(passport.initialize());
app.use(passport.session());

// Define the  Base URL for YouTube Data API
//const baseApiUrl = 'https://www.googleapis.com/youtube/v3/videos'; // For getting video details


// Create a route for the home page

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate to YouTube</a>');
});


app.listen(4200, () => {
    console.log('App listening on port 4200 :)');
});

// End


