
// Begin

// Authentication and Authorization Middleware

// Import passport, strategy, and the Google OAuth2 API keys
const passport = require('passport');
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


// End


