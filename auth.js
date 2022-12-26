// Authentication and Authorization Middleware
// Declare strategy, and the Google OAuth2 API keys
const CONFIG = require("./config");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = CONFIG.oauth2Credentials.client_id;
const GOOGLE_CLIENT_SECRET = CONFIG.oauth2Credentials.client_secret;

// Create a passport middleware to handle Google OAuth2 login
passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:4200/oauth2callback",
            cb: "http://localhost:4200/oauth2callback",
            passReqToCallback: true
        },function (request, accessToken, refreshToken, profile, done) {
            return done(null, profile);

        }
    )
);


// Create a passport middleware to handle User serialization
passport.serializeUser(function(user, done) {
    done(null, user);
});
// Create a passport middleware to handle User deserialization
passport.deserializeUser(function(user, done) {
    done(null, user);
});