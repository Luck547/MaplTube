
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
    const session = req.session;
    const tokens = session["tokens"];
    const oauth2Client = new google.auth.OAuth2(
        CONFIG.oauth2Credentials.client_id,
        CONFIG.oauth2Credentials.client_secret,
        CONFIG.oauth2Credentials.redirect_uris[0]
    );
    oauth2Client.setCredentials(tokens);
    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client

    }
    );
    youtube.videos.getRating({
        id: 'M7lc1UVf-VE',
        auth: oauth2Client

    })
    .then((response) => {
        res.send(response.data);
        })
    .catch((err) => {
        console.log(err);
        }
    );
});

app.get('/subscription_list', () => {
    const oauth2client = new OAuth2(
        CONFIG.oauth2Credentials.client_id,
        CONFIG.oauth2Credentials.client_secret,
        CONFIG.oauth2Credentials.redirect_uris[0]);

    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2client
    });
    const params = {
        videoId: 'QZ4BXGgmATU',
        id : 'QZ4BXGgmATU',
    }

    async function runSample() {
        const res = await youtube.videos.getRating(params);
        console.log(`The blog url is ${res.data.res}`);
    }
    runSample().catch(console.error);

    youtube.videos.getRating(params, (err, response) => {
        if (err) {
            console.log(err);
        } else {
            console.log(response.data);
        }


    }   );
    }    );


// Create a route that get the ranking of a video by its ID with the YouTube Data API and the OAuth2 Client
app.get('/getRating2', (req, res) => {
    // Get the videoId from the URL
    const videoId = '3VHCxuxtuL8';
    const api_key = 'AIzaSyD1m8mu9rBNy1di-MhK9n49I7lC20U6g00';
    console.log(videoId);
    console.log(api_key);

    // Create a new instance of the YouTube Data API


    const scopes = [
        'https://www.googleapis.com/auth/youtube.readonly',
    ];
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        console.log(url);

        // Get the YouTube Data API
        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client
        });

        // Get the rating of the video
        youtube.videos.getRating({
            auth: oauth2Client,
            id: videoId,
    });
    res.send('Rating of the video with ID ' + videoId + ' is ' + rating);
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