const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("this will be the landing page soon");
})

app.listen(port, () => {
    console.log('Yelp Camp Server has started!');
})