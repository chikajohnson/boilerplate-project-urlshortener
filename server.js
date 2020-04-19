'use strict';

var express = require('express');
var mongoose = require('mongoose');

var cors = require('cors');
const { saveUrl, redirectUrl } = require('./app/route');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
mongoose.connect(process.env.DB_URI || "mongodb+srv://admin:!pass4sure@cluster0-94hvv.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: false
})
  .then(() => {
    console.log('db connection successful!');
  }).catch(err => {
    console.log(err);    
  });

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post("/api/shorturl/new", saveUrl);
app.get("/api/shorturl/:code", redirectUrl);


app.listen(port, function () {
  console.log('Node.js listening ...');
});