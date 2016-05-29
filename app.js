
// app.js

// scotch.io ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();

//++++
var path = require('path');
var favicon = require('serve-favicon');
//++++

var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


var configDB = require('./app/config/dbConfig.js');

//+++++
var routes = require('./app/routes');
var users = require('./app/users');
//+++++

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./app/config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)

//++++
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'app/public')));
app.use(express.static(path.join(__dirname, 'app/bower_components')));
//+++++

// view engine setup
//+++
app.set('views', path.join(__dirname, 'app/views'));
//++++
app.set('view engine', 'ejs'); // set up ejs for templating

// +++++
app.set('json spaces', 40);
// +++++

//-----
//app.use('/', routes);
//-----
//+++++
app.use('/users', users);
//+++++

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
//---
//app.listen(port);
//console.log('The magic happens on port ' + port);
//----

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
app.listen(8080,function(){
    console.log("Working on port 8080");
});