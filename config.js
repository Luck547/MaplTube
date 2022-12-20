
//  Some Setup
const port = process.env.PORT || 4200;
const baseUri = 'http://localhost:${port}';

//  The following code is for the Google OAuth 2.0
//  https://developers.google.com/identity/protocols/oauth2

const keys = require('./keys.json');

module.exports = {
    JWT_SECRET: 'Fragsy',
    baseUri: baseUri,
    port: port,

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
            'https://www.googleapis.com/auth/youtube'
        ]
        }
}

//  End of the Google OAuth 2.0
