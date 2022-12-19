const express = require('express');
const passport = require('passport');
require('./auth');

const app = express();

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate to YouTube</a>');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/protected', (req, res) => {
    res.send('This is protected');
});


app.listen(4200, () => {
    console.log('App listening on port 4200 :)');
});

