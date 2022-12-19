
//Begin

// Import the express and passport module
const express = require('express');
const passport = require('passport');

// Bring back the passport config
require('./auth');

// Create an express app
const app = express();

// Create a route for the home page
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate to YouTube</a>');
});

// Create a route for the authentication
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Create a route for the callback
app.get('/oauth2callback', passport.authenticate('google', {
    successRedirect: '/getRating',
    failureRedirect: '/auth/failure'
}));

// Create a route for the failure
app.get('/auth/failure', (req, res) => {
    res.send('Failed to authenticate');
});

// Create a route protected by the authentication
app.get('/getRating', (req, res) => {
    res.send('This is protected');
});


app.listen(4200, () => {
    console.log('App listening on port 4200 :)');
});



// End


