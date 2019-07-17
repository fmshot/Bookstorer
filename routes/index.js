var express = require('express');
var router = express.Router();
var authenticate = require('../authenticate');

// GET home page.
// router.get('/',  function(req, res, next) {
//   authenticate.checkAuthorizationToken(req, res, next)}, function(req, res) {
//   res.redirect('/catalog');
// });

router.get('/', function (req, res) {
  res.redirect('/catalog');
});

// module.exports = router;
module.exports = router;