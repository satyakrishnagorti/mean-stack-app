// BASE SETUP
// Getting the required packages

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');

// Connect to MongoDB
mongoose.connect(config.database);


//APP Configuration
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//configure to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});

app.use(morgan('dev'));

// set static files location
app.use(express.static(__dirname + '/public'));

//ROUTES FOR API
var apiRouter = require('./app/routes/api')(app, express);
app.use('/api', apiRouter);

// catchall route
// send users to frontend
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(config.port);


console.log('running on PORT ' + config.port);
