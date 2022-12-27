
// Imports
const sqlite3 = require('sqlite3');
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

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Erro opening database " + err.message);
    } else {

        db.run('CREATE TABLE rating( \
            employee_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            videoId NVARCHAR(20)  NOT NULL,\
            first_name NVARCHAR(20)  NOT NULL,\
            title NVARCHAR(20),\
            address NVARCHAR(100),\
            country_code INTEGER\
        )', (err) => {
            if (err) {
                console.log("Table already exists.");
            }
            let insert = 'INSERT INTO rating (videoId, first_name, title, address, country_code) VALUES (?,?,?,?,?)';
            db.run(insert, ["Chandan", "Praveen", "SE", "Address 1", 1]);
            db.run(insert, ["Samanta", "Mohim", "SSE", "Address 2", 1]);
            db.run(insert, ["Gupta", "Pinky", "TL", "Address 3", 1]);
        });
    }
});

// End
