'use strict';

// load modules
var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    mongooseValidate = require('mongoose-validate'),
    seeder = require('mongoose-seeder'),
    data = require('./data/data.json'),
    User = require('./models/user'),
    Course = require('./models/course'),
    Review = require('./models/review'),
    userRoutes = require('./routes/users'),
    courseRoutes = require('./routes/courses'),
    app = express();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// db connection
mongoose.connect('mongodb://localhost:27017/course_ranking_api');
var db = mongoose.connection;

db.once('open',function(){
	console.log('Connection opened');
  seeder.seed(data).then(function(dbData) {
    // The database objects are stored in dbData
    console.log('data seeded :) ');
  }).catch(function(err) {
      // handle error
      console.error(err);
  });
});

db.on('close',function(){
	console.log('Connection closed');
});

db.on('error',function(){
  console.error('Connection error');
});

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// setup router
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);


app.use(function(req, res, next) {
  if(res.statusCode = 204){
    console.log(res.statusCode + ' - No content');
    res.end();
  }
});

// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var fullError = err.status + ': ' + err.message;
  res.send(fullError);
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
