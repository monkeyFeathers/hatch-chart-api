var express = require('express');
var passport = require('passport')
var router = express.Router();
var Bug = require('../models/Bug')

function handleErr(next, err) {if (err) next(err)};
var authorizeBearer = passport.authenticate('bearer', { session: false });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('hello');
});


// routes for github authentication
router.get(
  '/auth/github',
  passport.authenticate('github', {session: false, scope: []})
)

router.get(
  '/auth/github/callback',
  passport.authenticate('github', {session: false, failureRedirect: '/'}),
  function(req, res) {
    res.redirect("/profile?access_token=" + req.user.access_token);
  }
);

router.get('/', function(req, res) {
  res.send('<a href="/auth/github">Log in</a>');
});

router.get('/profile', authorizeBearer,
  function(req, res) {
    res.send("LOGGED IN as " + req.user.githubId + " - <a href=\"/logout\">Log out</a>");
});

router.get('/auth/test', authorizeBearer, function(req, res, next) {
  res.send('authenticated');

});

router.authorizeBearer = authorizeBearer;

module.exports = router;
