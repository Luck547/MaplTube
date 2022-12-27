
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
// Import config file
const CONFIG = require('./config');



require('./auth');

const { google } = require('googleapis');


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
   res.send('<a href="http://localhost:4200/getRating?videoId=QZ4BXGgmATU&code=.">http://localhost:4200/getRating?videoId=QZ4BXGgmATU&code=</a>');
});

// Create a route for the logout
app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

// Create a route for public information
app.get('/getRating', (req, res) => {



    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
    );



    oauth2Client.setCredentials({
        refresh_token: CONFIG.REFRESH_TOKEN
    });
    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
    });
    youtube.videos.getRating({
        id: req.query.videoId,
    }).then((response) => {
        res.send(response.data);

    }   );
});

app.listen(4200, () => {
    console.log('App listening on port 4200 :)');
});




// example of a video ID response
//{
//    "kind": "youtube#videoGetRatingResponse",
//    "etag": "CNWHKXVdwtQa2ruz_Qyl34C-z-o",
//    "items": [
//    {
//        "videoId": "XsUY50S1_Fk",
//        "rating": "like"
//    }
//]
//}



// End