var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var GithubStrategy = require('passport-github').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var bugs = require('./routes/bugs');

var app = express();

mongoose.connect(process.env.MONGO_CONNECTION)

var User = require('./models/User');
var Bug = require('./models/Bug');

// github auth setup
options = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_APP_SECRET,
  callbackURL: 'http://localhost:3127/auth/github/callback'
};

passport.use(
  new GithubStrategy(options,
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({githubId: profile.id}, function(err, result) {
        if (result) {
          result.access_token = accessToken;
          result.save(function(err, doc) { done(err, doc) })
        } else { done(err, result) }
      });
    })
);

// token auth setup
passport.use(new BearerStrategy(function(token, done) {
  User.findOne({access_token: token})
    .then(
      function(user) {
        if (!user) return done(null, false);
        return done(null, user, {scope: 'all'});
      },
      function(err) { if (err) return done(err) }
  )
}))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/api/bugs', routes.authorizeBearer, bugs);

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
