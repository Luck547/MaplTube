
const YOUTUBE_TOKEN = 'AIzaSyD1m8mu9rBNy1di-MhK9n49I7lC20U6g00';
const GOOGLE_REDIRECT_URI = 'http://localhost:4200/oauth2callback';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_CLIENT_ID = '765261513837-vbc1bh28rbvgn3qahk5ju7i0u4fvcjfm.apps.googleusercontent.com';

//  Some Setup
const port = process.env.PORT || 4200;
const baseUri = 'http://localhost:${port}';

//  The following code is for the Google OAuth 2.0
//  https://developers.google.com/identity/protocols/oauth2

const keys = require('./keys_new.json');

module.exports = {
    JWT_SECRET: 'Fragsy',
    baseUri: baseUri,
    port: port,
    YOUTUBE_TOKEN: YOUTUBE_TOKEN,
    GOOGLE_REDIRECT_URI: GOOGLE_REDIRECT_URI,
    GOOGLE_CLIENT_SECRET: GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID,


    oauth2Credentials: {
        client_id: keys.web.client_id,
        project_id: keys.web.project_id,
        auth_uri: keys.web.auth_uri,
        token_uri: keys.web.token_uri,
        auth_provider_x509_cert_url: keys.web.auth_provider_x509_cert_url,
        client_secret: keys.web.client_secret,
        redirect_uris: [
            keys.web.redirect_uris[0]
        ],
        javascript_origins: [
            keys.web.javascript_origins[0]
        ],
        scopes: [
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtubepartner',
            'https://www.googleapis.com/auth/youtube.force-ssl',
        ]
        }
}

//  End of the Google OAuth 2.0
