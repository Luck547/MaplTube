const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const apiKey = 'AIzaSyBK1st4o-7-leGvUqgKfwGOwrS46GGtq8E';
const apiUrl = 'https://www.googleapis.com/youtube/v3';
// https://www.googleapis.com/youtube/v3/search?key=api_key&type=video&part=snippet&q=foo
app.get('/', (req, res) => res.send('Hello from MaplTube API!'));

app.get("/search", async (req, res, next) => {
    try {
        const searchQuery = req.query.q;
        const url = `${apiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`;

        const response = await axios.get(url);
        const titles = response.data.items.map((item) => item.snippet.title);

        res.send(titles);
    } catch (err) {
        next(err);
    }
});

app.listen(port, () => console.log(`MaplTube App listening on port ${port}!`));
