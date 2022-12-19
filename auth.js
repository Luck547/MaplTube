const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = '765261513837-vbc1bh28rbvgn3qahk5ju7i0u4fvcjfm.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';


passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4200/oauth2callback",
        passReqToCallback: true
    },
    function(accessToken, refreshToken, profile, cb, done, err) {return cb(err, profile);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

