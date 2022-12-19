
//Begin

// Import the express and passport, passport-session modules
const express = require('express');
const session = require('express-session');
const passport = require('passport');

// Create a function that verifies the user is logged in
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);}

// Bring back the passport config
require('./auth');

// Create an express app & initialize passport and session
const app = express();
app.use(session({ secret: 'Fragsy' }));
app.use(passport.initialize());
app.use(passport.session());

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
app.get('/getRating', isLoggedIn, (req, res) => {
    res.send('This is protected');
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


