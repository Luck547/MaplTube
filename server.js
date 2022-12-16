const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello from MaplTube API!'));

app.listen(port, () => console.log(`MaplTube App listening on port ${port}!`));

