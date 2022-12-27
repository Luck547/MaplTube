
// Imports
require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Express web server framework
const session = require('express-session'); // Express session middleware
const passport = require('passport'); // Passport authentication middleware
require('./auth'); // Load authentication strategies
const { google } = require('googleapis'); // Google API library
const youtube = google.youtube('v3'); // YouTube API library
const path = require('path'); // Path library
const {authenticate} = require('@google-cloud/local-auth'); // Local authentication library

                // Create an instance of the express app and define the endpoints, cookies and sessions
// Create an express app
const app = express();

app.use(session({ secret: 'Fragsy', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

// Create a route for the home page
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate to YouTube</a>');});

// Create a route for the authentication
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Create a route for the callback
app.get('/oauth2callback', function (req, res) {
    passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            res.redirect('/success');
        }
    res.redirect('/success');
    });

// Create a route for the failure
app.get('/auth/failure', (req, res) => {
    res.send('Failed to authenticate');});

// Create a route for the success
app.get('/success', (req, res) => {
   res.send('<a href="http://localhost:4200/getRating?videoId=QZ4BXGgmATU">http://localhost:4200/getRating?videoId=QZ4BXGgmATU</a>');
});

// Create a route for the logout
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

// Create a route for public information
app.get('/getRating', (req, res) => {
    const videoId = req.query.videoId;
    req.session.videoId = videoId;
    res.send('<a href="/getRating">Get Rating</a>');
    console.log(req.session.videoId);
    console.log(videoId);
    const auth = authenticate({
        keyfilePath: path.join(__dirname, './oauth2.keys.json'),
        scopes: ['https://www.googleapis.com/auth/youtube'],
        });
    google.options({auth});
    const response = youtube.videos.getRating({
        id: 'QZ4BXGgmATU',
        auth: auth,
    });
    console.log(response.data);
});

app.listen(4200, () => {
    console.log('App listening on port 4200 :)');
});

// End
