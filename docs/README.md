# MaplTube

The app verifies whether an authenticated YouTube user voted on a particular YouTube video based on liking, disliking, or not voting.

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
- [EJS](https://ejs.co/) //Not used
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [cookie-session](https://www.npmjs.com/package/cookie-session)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)


### Installing

1. Clone the repo

```sh
git clone https://github.com/Luck547/MaplTube.git
```

2. Install NPM packages

```sh
sudo npm install
```

3. Create or modify a `.env` file in the root directory and add the following if your want to use your own Api Keys and OAuth2 credentials

```JS
CLIENT_ID= // Your client ID
CLIENT_SECRET= // Your client secret
YOUTUBE_TOKEN=AIzaSyBK1st4o-7-leGvUqgKfwGOwrS46GGtq8E // Your YouTube API key
```


## Usage

1. Run the app

```JS
npm start
```
or 


```JS
nodemon index.js
```
or even 

```JS
node index.js
```

1. Verify the server is running on `localhost:4200` after npm start or node index.js.
2. Open your browser and go to `http://localhost:4200`.
3. Click on the `Authenticate to YouTube` hyperlink.
4. Lind and login on your Google Acount (ask me it needed to add more tester users.
5. Enter the video ID of the video you want to check. The easy way, in the /success endnpoint in the browser paste: http://localhost:4200/getRating/?videoId=3VHCxuxtuL8
6. Click on the `Enter` keyboard execution.
7. The app will return whether or not you voted on the video.
8. Click on the `Logout` button to logout or go to `http://localhost:4200/logout`.
9. Loop.

End
