'use strict';

const {google} = require('googleapis');
const youtube = google.youtube('v3');
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');

// initialize the Youtube API library

// a very simple example of searching for youtube videos
async function runSample() {
    const auth = await authenticate({
        keyfilePath: path.join(__dirname, './oauth2.keys.json'),
        scopes: ['https://www.googleapis.com/auth/youtube'],
    });

    // google.options({auth});

    const res = await youtube.videos.getRating({
        id: 'QZ4BXGgmATU',
        auth: auth,
    });
    console.log(res.data);
}

if (module === require.main) {
    runSample().catch(console.error);
}