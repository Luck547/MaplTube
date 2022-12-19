
//Begin

// Start the whole thing with node index.js

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

// Create an express app & initialize passport and session
const app = express();
app.use(session({ secret: 'Fragsy' }));
app.use(passport.initialize());
app.use(passport.session());

// Define the  Base URL for YouTube Data API
//const baseApiUrl = 'https://www.googleapis.com/youtube/v3/videos'; // For getting video details


// Create a route for the home page

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate to YouTube</a>');
});

// Import Axios
const axios = require('axios');

// Create a function that verifies the user is logged in
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);}

const baseApiUrl = 'https://www.googleapis.com/youtube/v3'; // For searching videos

// Create a route for the authentication
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Create a route for the callback
app.get('/oauth2callback', passport.authenticate('google', {
    successRedirect: '/success',
    failureRedirect: '/auth/failure'
}));



// Create a route for the failure
app.get('/auth/failure', (req, res) => {
    res.send('Failed to authenticate');
});

// Create a route protected by the authentication
app.get('/getRating', isLoggedIn, (req, res) => {
    //const rating = getRating(req.user);
    const videoId = req.query.videoId;
    const rating = req.query.getRating;
    //const response = await axios.get(`${baseApiUrl}/getRating/?key=${apiKey}&videoId=${videoId}&rating=${rating}`);
    //const url = `${baseApiUrl}/getRating?key=${apiKey}&videoId=${videoId}&rating=${rating}`;
    //const url = `${baseApiUrl}/getRating?id=${videoId}`;
    const url = `${baseApiUrl}/getRating?key=${apiKey}&id=3VHCxuxtuL8`;
    const response = axios.get(url);
    //res.send(`Welcome ${req.user.displayName}!` + ` Your rating for the video ${videoId} is ${rating}`);
    //console.log(`Your rating for the video ${videoId} is ${response}`);
    letssee = getVideoRating('M7lc1UVf-VE');
    res.send(letssee, videoId, rating, response);
});

// New testing route using Axios and plain JavaScript
app.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const url = `${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`;
        const response = await axios.get(url);
        const tittles = response.data.items.map(item => item.snippet.title);
        //res.send(response.data.items);
        res.send(tittles);
        console.log(response.data.items);
    } catch (error) {
    }

});

// The same of search but using the googleapis library
app.get('/search-with-googleapis', async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const response = await youtube.search.list({
            part: 'snippet',
            q: searchQuery,
            type: 'video'
        });
        const tittles = response.data.items.map(item => item.snippet.title);
        //res.send(response.data.items);
        res.send(tittles);
        console.log(response.data.items);
    } catch (error) {
    }

});


// Create a route for the logout
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.listen(4200, () => {
    console.log('App listening on port 4200 :)');
});

// End


