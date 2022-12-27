//'use strict';

const {google} = require('googleapis');
const path = require('path');
const {authenticate} = require('@google-cloud/local-auth');

// initialize the YouTube API library
const youtube = google.youtube('v3');

// a very simple example of searching for YouTube videos
async function runSample() {
    const auth = await authenticate({
        keyfilePath: path.join(__dirname, './oauth2.keys.json'),
        scopes: ['https://www.googleapis.com/auth/youtube'],
    });
 //   google.options({auth});

    const response = await youtube.videos.getRating({
        id: 'QZ4BXGgmATU',
        auth: auth,
    });
    console.log(response.data);
}


    runSample().catch(console.error);


module.exports = runSample;
