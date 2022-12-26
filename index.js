
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
// Import config file
const CONFIG = require('./config');
// Import JWT
const jwt = require('jsonwebtoken');
// Import CookieParser
const cookieParser = require('cookie-parser');
// Import EJS
const ejs = require('ejs');

// Import The Google Apis
const google = require('googleapis').google;
// Import The Google Auth Library
const googleAuth = require('google-auth-library');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    CONFIG.oauth2Credentials.client_id,
    CONFIG.oauth2Credentials.client_secret,
    CONFIG.oauth2Credentials.redirect_uris[0]
);



                                // Authentication and Authorization Middleware
// Declare strategy, and the Google OAuth2 API keys
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = CONFIG.oauth2Credentials.client_id;
const GOOGLE_CLIENT_SECRET = CONFIG.oauth2Credentials.client_secret;
const GOOGLE_REDIRECT_URI = CONFIG.oauth2Credentials.redirect_uris[0];




// Create a passport middleware to handle Google OAuth2 login
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4200/oauth2callback",
        cb: "http://localhost:4200/oauth2callback",
        passReqToCallback: true
    },
    async function (request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));
// Create a passport middleware to handle User serialization
passport.serializeUser(function(user, done) {
    done(null, user);
});
// Create a passport middleware to handle User deserialization
passport.deserializeUser(function(user, done) {
    done(null, user);
});

                // Create an instance of the express app and define the endpoints, cookies and sessions
// Create an express app
const app = express();

// Set view engine to ejs
app.set('view engine', 'ejs');


// Use the cookie parser, session and passport middlewares
app.use(cookieParser());
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
    const oauth2client = new OAuth2(
        CONFIG.oauth2Credentials.client_id,
        CONFIG.oauth2Credentials.client_secret,
        CONFIG.oauth2Credentials.redirect_uris[0]
    );

    if (req.query.error) {
        // The user did not give us permission.
        res.send('You did not give us permission.');
        return res.redirect('/');
    }   else {
            oauth2client.getToken(req.query.code, function (err, token) {
                if (err) {
                    console.log(err);
                    res.cookie('jwt', jwt.sign(token, CONFIG.JWT_SECRET));

                    return res.redirect('/suscription_list');
                } else {
                    oauth2client.setCredentials(token);
                    res.redirect('/success');
                }
    });
    }


    oauth2Client.getToken(req.query.code, function (err, token) {
        if (err) {
            console.log('Error authenticating');
            console.log(err);
            res.cookie('jwt', jwt.sign(token, CONFIG.JWT_SECRET));
            return res.redirect('/');
            } else {
                console.log('Successfully authenticated');
                oauth2Client.setCredentials(token);
                res.cookie('tokens', token);
                res.redirect('/success');
            }

    });
});


// Create a route for the failure
app.get('/auth/failure', (req, res) => {
    res.send('Failed to authenticate');});
// Create a route for the success
app.get('/success', (req, res) => {
    let test_html = '<h1> Now go to http://localhost:4200/getRating/?videoId=3VHCxuxtuL8 or your desire videoId from the URL YouTube link </h1>';
    res.send('Successfully authenticated' + '\n' + test_html);

});
// Create a route for the logout
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
        console.log('Logged out');});});


// Create a route for public information
app.get('/public', (req, res) => {
    const oauth2client = new OAuth2(
        CONFIG.oauth2Credentials.client_id,
        CONFIG.oauth2Credentials.client_secret,
        CONFIG.oauth2Credentials.redirect_uris[0]);

    const loginLink = oauth2client.generateAuthUrl({
        access_type: 'offline',
        scope:CONFIG.oauth2Credentials.scopes
    });
   return res.render('index', {loginLink: loginLink});

});

app.get('/subscription_list', (req, res) => {
    const oauth2client = new OAuth2(
        CONFIG.oauth2Credentials.client_id,
        CONFIG.oauth2Credentials.client_secret,
        CONFIG.oauth2Credentials.redirect_uris[0]);

    const loginLink = oauth2client.generateAuthUrl({
        access_type: 'offline',
        scope:CONFIG.oauth2Credentials.scopes
    });
    return res.render('subscription_list', {loginLink: loginLink});

} );


// Create a route that get the ranking of a video by its ID with the YouTube Data API and the OAuth2 Client
app.get('/getRating', (req, res) => {
    // Get the videoId from the URL
    const videoId = req.query.videoId;
    const api_key = req.query.YOUTUBE_TOKEN;
    console.log(videoId);
    // Get the OAuth2 Client
    const oauth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
    );
    const scopes = [
        'https://www.googleapis.com/auth/youtube.readonly',
    ];


    // Generate a url that asks permissions for the Drive activity scope
    const authorizationUrl = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',
        /** Pass in the scopes array defined above.
         * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true
    });

    res.writeHead(301, {"Location": authorizationUrl});
    // Get the token from the cookies
    const token = req.cookies.tokens;
// Set the credentials
    oauth2Client.setCredentials({
        access_token: req.cookies.tokens.access_token,
        refresh_token: req.cookies.tokens.refresh_token
    });

    // Get the ranking of the video
    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
    });
youtube.videos.getRating({
        id: videoId,
        auth: oauth2Client,
        part: 'snippet, statistics',
        key: api_key
    }, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    }
);
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