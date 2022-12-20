
//Begin

                            // Start the whole thing with nodemon index.js

// Import the dotenv, express, the express-session and passport modules
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');

// Import config file
const CONFIG = require('./config');

// Import JWT
//const jwt = require('jsonwebtoken');

// Import CookieParser
const cookieParser = require('cookie-parser');
// Import The Google Apis
const {google} = require('googleapis');
// Define the Api Key and Variables for the Google API:
const apiKey = 'AIzaSyBK1st4o-7-leGvUqgKfwGOwrS46GGtq8E';
const OAuth2 = google.auth.OAuth2;

//  https://www.googleapis.com/youtube/v3/getRating/?key=apiKey&videoId=videoId
//  https://www.googleapis.com/youtube/v3/getRating/?key=AIzaSyBK1st4o-7-leGvUqgKfwGOwrS46GGtq8E&videoId=QZ4BXGgmATU
//  https://www.googleapis.com/youtube/v3/search/?key=apiKey&part=snippet&maxResults=25&q=videoId
//  https://www.googleapis.com/youtube/v3/search/?key=AIzaSyBK1st4o-7-leGvUqgKfwGOwrS46GGtq8E&part=snippet&maxResults=25&q=QZ4BXGgmATU

                                // Authentication and Authorization Middleware

// Declare strategy, and the Google OAuth2 API keys
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = '765261513837-vbc1bh28rbvgn3qahk5ju7i0u4fvcjfm.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

// Create a passport middleware to handle Google OAuth2 login
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4200/oauth2callback",
        cb: "http://localhost:4200/oauth2callback",
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

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
const baseApiUrl = 'https://www.googleapis.com/youtube/v3/videos'; // For getting video details

// Create a route for the home page
app.get('/', (req, res) => {
    console.log(req.cookies);
    console.log("*****************");
    console.log(req.session);
    res.send('<a href="/auth/google">Authenticate to YouTube</a>');});


// Import Axios
// const axios = require('axios');

// Create a function that verifies the user is logged in
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);}

// Create a route for the authentication
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Create a route for the callback

app.get('/oauth2callback', function (req, res) {
    const oauth2Client = new OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        'http://localhost:4200/oauth2callback'
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
                return res.redirect('/');
                //res.cookies(jwt, jwt.sign(token, CONFIG.JWT_SECRET));
                //res.cookie(jwt.sign('token', CONFIG.JWT_SECRET));
            } else {
                console.log('Successfully authenticated');
                oauth2Client.setCredentials(token);
                res.cookie('tokens', token);
                //res.redirect('/getVideoDetails');
                return res.redirect('/getVideoDetails');
            }

    });
    }
});

app.get('/getVideoDetails', function (req, res) {
    const oauth2Client = new OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        'http://localhost:4200/oauth2callback'
    );
    oauth2Client.setCredentials(req.cookies.tokens);
    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
    });
    youtube.videos.list({
        part: 'snippet,statistics',
        id: 'QZ4BXGgmATU'
    }, (err, data) => {
        if (err) {
            res.send('Error');
        } else {
            res.send(data.data.items);
        }
    });
});

//app.get('/oauth2callback', passport.authenticate('google', {
//    successRedirect: '/success',
//    failureRedirect: '/auth/failure'}));

// Create a route for the failure
app.get('/auth/failure', (req, res) => {
    res.send('Failed to authenticate');});

// Create a route for the success
app.get('/success', isLoggedIn, (req, res) => {
    let test_html = '<h1>Success</h1>';
    res.send('Successfully authenticated' + '\n' + test_html);});

// New testing route using Axios and plain JavaScript
app.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const url = `${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`;
        //const response = await axios.get(url);
        const tittles = response.data.items.map(item => item.snippet.title);
        console.log(req.cookies);
        console.log("*****************");
        console.log(req.session);
        console.log(url);
        //res.send(response.data.items);
        res.send(tittles);
        console.log(response.data.items);
    } catch (error) {}});

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
        console.log(req.cookies);
        console.log("*****************");
        console.log(req.session);
        res.send(response.data.items);
        res.send(tittles);
        console.log(response.data.items);
    } catch (error) {}});

app.get('/getRating', async (req, res) => {
    try {
        const oauth2Client = new google.auth.OAuth2(
            CONFIG.oauth2Credentials.client_id,
            CONFIG.oauth2Credentials.client_secret,
            CONFIG.oauth2Credentials.redirect_uris[0]
        );
        const videoId = req.query.videoId;

        //rating = google.youtube.videos.getRating({key: apiKey, id: videoId}).then(response => console.log(response.data.items[0].rating));
        //google.youtube.videos.getRating({key: process.env.GOOGLE_CLIENT_SECRET, id: videoId}).then(response => console.log(response.data.items[0].rating));
        //part: 'snippet',
        //id: videoId}).then(response => console.log(response.data.items[0].rating));
        res.send(`Welcome ${req.user.displayName}!` + ` Your rating for the video ${videoId} is ${videoId}`);

        const loginLink = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/youtube.readonly'
        });
        return res.render('index', { loginLink: loginLink });
    } catch (error) {}});

// Create a route for the logout
app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
app.listen(4200, () => {
    console.log('App listening on port 4200 :)');
});

// End