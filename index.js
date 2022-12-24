//Begin
                            // Start the whole thing with nodemon index.js or node index.js
// Import the dotenv, express, the express-session and passport modules and more

'use strict';

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
// Import The Google Apis
const {google} = require('googleapis');
const {response} = require("express");
console.log(response)
// Define the OAuth2 Client
const OAuth2 = google.auth.OAuth2;
// initialize the YouTube API library
const youtube = google.youtube('v3');
//const gapi = require('gapi');
console.log(youtube)
//  https://www.googleapis.com/youtube/v3/getRating/?key=GOOGLE_CLIENT_ID&videoId=videoId
//  https://www.googleapis.com/youtube/v3/getRating/?key=AIzaSyBK1st4o-7-leGvUqgKfwGOwrS46GGtq8E&videoId=QZ4BXGgmATU
//  https://www.googleapis.com/youtube/v3/search/?key=apiKey&part=snippet&maxResults=25&q=videoId
//  https://www.googleapis.com/youtube/v3/search/?key=AIzaSyBK1st4o-7-leGvUqgKfwGOwrS46GGtq8E&part=snippet&maxResults=25&q=QZ4BXGgmATU

                                // Authentication and Authorization Middleware
// Declare strategy, and the Google OAuth2 API keys
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = CONFIG.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = CONFIG.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = CONFIG.GOOGLE_REDIRECT_URI;
const YOUTUBE_TOKEN = CONFIG.YOUTUBE_TOKEN;

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
// Use the cookie parser, session and passport middlewares
app.use(cookieParser());
app.use(session({ secret: 'Fragsy', saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());

// Define the  Base URL for YouTube Data API
const baseApiUrl = 'https://www.googleapis.com/youtube/v3/videos/getRating'; // For getting video details

// Create a route for the home page
app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate to YouTube</a>');});

// Create a route for the authentication
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Create a route for the callback
app.get('/oauth2callback', function (req, res) {
    const oauth2Client = new OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
    );
    if(req.query.error){
        res.send('You must allow the app to view your profile data.');
        res.redirect('/');
    }
    else{
        oauth2Client.getToken(req.query.code, function (err, token) {
            if (err) {
                console.log('Error authenticating');
                console.log(err);
                res.cookie(jwt, jwt.sign(token, CONFIG.JWT_SECRET));
                return res.redirect('/');
            } else {
                console.log('Successfully authenticated');
                oauth2Client.setCredentials(token);
                res.cookie('tokens', token);
                res.redirect('/success');
            }
    });
    }
});

// Create a route for the failure
app.get('/auth/failure', (req, res) => {
    res.send('Failed to authenticate');});
// Create a route for the success
app.get('/success', (req, res) => {
    let test_html = '<h1> Now go to http://localhost:4200/getRating/?videoId=3VHCxuxtuL8 or your desire videoId from the URL YouTube link </h1>';
    res.send('Successfully authenticated' + '\n' + test_html);
    console.log(baseApiUrl + '?key=' + YOUTUBE_TOKEN + '&videoId=' + 'QZ4BXGgmATU');});
// Create a route for the logout
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
        console.log('Logged out');});});

app.get('/index', (req, res) => {
    res.redirect('/index.html');});

app.get('/test', function(request, response){
    response.sendFile('index.html');
});


// Create a route that get the ranking of a video by its ID with the YouTube Data API and the OAuth2 Client
app.get('/getRating', async function (req, res) {

    const videoId = req.query.videoId;
    console.log(videoId);
    const oauth2Client = new OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
    );
    const scopes = [
        'https://www.googleapis.com/auth/youtubepartner',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl',
    ];

    oauth2Client.youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client,
        scopes: scopes
    });
    oauth2Client.setCredentials(req.cookies.tokens);

    const response = oauth2Client.youtube.videos.getRating({
        id: videoId,
    },  function (response2) {
        console.log(response);
        res.send(response  + response2);
    });

    /**
     * Set required API keys and check authentication status.
     */
    this.handleClientLoad = function(apiKey) {
        gapi.client.setApiKey(apiKey);
    };

    /**
     * Load the Google Cloud Storage API.
     */
    this.initializeApi = function(apiVersion){
        gapi.client.load('storage', apiVersion).then(function success(res) {
            res.send(res);
                console.log('loaded storage api');
            },
            function error(res) {
                return alert('Error loading storage api: ' + JSON.stringify(res)); // throw error
            });
    };

    /**
     * Google Cloud Storage API request to retrieve the list of buckets in
     * your Google Cloud Storage project.
     */
    this.listBuckets = function(projectId) {
        var request = gapi.client.storage.buckets.list({  // <-- ERROR
            'project': projectId
        });
        console.log(request);
    };

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

// Some tings to improve:
// 1. The OAuth2 Client is not working properly, it is not getting the token from the cookies
// 2. The YouTube Data API is not working properly, it is not getting the video rating
// 3. To fix the scope of the OAuth2 Client, I have to use the Google API Console, but I don't know how to do it
// 4. The front-end is not working properly, it is not getting the videoId from the URL
// 5. The front-end is not working properly, it is not getting the video rating from the back-end



// End