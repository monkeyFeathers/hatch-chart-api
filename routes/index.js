var express = require('express');
var router = express.Router();
var Bug = require('../models/Bug')

function handleErr(next, err) {if (err) next(err)};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('hello');
});

module.exports = router;
