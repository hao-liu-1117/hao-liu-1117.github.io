const express = require('express');
const cors = require('cors');
const path = require('path');

var search = require('./routes/search');
var movie = require('./routes/movie');
var tv = require('./routes/tv');
var cast = require('./routes/cast');

const app = express();

app.use(cors());

app.use('/apis/search', search);
app.use('/apis/movie', movie);
app.use('/apis/tv', tv);
app.use('/apis/cast', cast);

app.use('/*', (req, res) => {
  res.send("<h1>Home</h1>");
});

var server = app.listen(8080, () => {
  console.log("Backend app listening at http://localhost:8080");
});

module.exports = server;