var express = require('express');
var router = express.Router();
var Bug = require('../models/Bug')
var _ = require('lodash')

function handleErr(next, err) {if (err) next(err)};

/* CREATE*/
router.post('/', function(req, res, next) {
  var bug = new Bug(req.body);
  bug.save()
  .then(
    function(sBug) {res.json({msg:'1 bug successfully saved', id:sBug.id})},
    function(err) {handleErr(next, err)}
  )
});

/* READ */
/* GET Bugs home page sends all bugs */
router.get('/', function(req, res, next) {
  Bug.find()
  .then(
    function(bugs) { res.json(bugs) },
    function(err) { handleErr(next, err)}
  )
});

/* GET one bug by id. */
router.get('/:bugId', function(req, res, next) {
  Bug.findById(req.params.bugId)
  .then(
    function(bug) { res.json(bug) },
    function(err) { handleErr(next,err) }
  );
});

/* UPDATE */
router.put('/:bugId', function(req, res, next) {
  Bug.findById(req.params.bugId)
  .then(
    function(bug) {
      for (var param in req.body) bug[param] = req.body[param];
      bug.save().then( function(bg) { res.json(bg) } );
    },
    function(err) { handleErr(next, err) }
  );
})

/* DELETE */
router.delete('/:bugId', function(req, res, next) {
  Bug.findByIdAndRemove(req.params.bugId)
  .then(
    function() { res.send('1 bug successfully deleted') },
    function(err) { handleErr(next, err) }
  )
})

module.exports = router;
