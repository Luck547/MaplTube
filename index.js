
// Imports
require('dotenv').config(); // Load environment variables from .env file
const express = require('express'); // Express web server framework
const session = require('express-session'); // Express session middleware
const passport = require('passport'); // Passport authentication middleware
require('./auth'); // Load authentication strategies
const getLike = require ('./getLike'); // Load getLike.js


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
   res.send('<a href="http://localhost:4201/getRating?videoId=QZ4BXGgmATU">http://localhost:4201/getRating?videoId=QZ4BXGgmATU</a>');
});

// Create a route for the logout
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

// Create a route for public information
app.get('/getRating', (req, res) => {
       getLike.getLike(req.query.videoId, req.user.accessToken, (err, data) => {
        if (err) {
            res
                .status(500)
       }
        res.send(data);
}   )});


app.listen(4201, () => {
    console.log('App listening on port 4201 :)');
});

// End