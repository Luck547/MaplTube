# MaplTube

The app verifies whether or not an authenticated Youtube user voted on a particular YouTube video based on liking, disliking, or not voting.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Google API Console](https://console.developers.google.com/)
- [API Key](https://developers.google.com/youtube/v3/getting-started)
- [OAuth 2.0 Client ID](https://developers.google.com/identity/protocols/OAuth2)
- [Express](https://expressjs.com/)
- [Passport](http://www.passportjs.org/)
- [Passport Google OAuth20](https://www.passportjs.org/packages/passport-google-oauth20/)
- [Axios](https://www.npmjs.com/package/axios)
- [Google Apis](https://www.npmjs.com/package/googleapis)


### Installing

1. Clone the repo

```sh
git clone https://github.com/Luck547/MaplTube.git
```

2. Install NPM packages

```sh
npm install
```

3. Create a `.env` file in the root directory and add the following

```JS
CLIENT_ID= // Your client ID
CLIENT_SECRET= // Your client secret


## Usage

1. Run the app

```JS
npm start
```

2. Open your browser and go to `http://localhost:4200`
3. Click on the `Authenticate to YouTube` hyperlink
4. Enter the video ID of the video you want to check
5. Click on the `Check` button
6. The app will return whether or not you voted on the video
7. Click on the `Logout` button to logout or go to `http://localhost:4200/logout`
8. Click on the `Login with Google` button to login again
9. Repeat steps 4-8
10. Click on the `Exit` button to exit the app
11. Click on the `Login with Google` button to login again
12. Repeat steps 4-10
13. Click on the `Exit` button to exit the app
14. Loop
