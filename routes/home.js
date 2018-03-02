var express = require('express');
var router = express.Router();
const passport = require('passport')

// Render post

router.get('/login',
  function(req, res){
    res.render('login/login');
  });

router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('../admin/posts');
    console.log()
  });
  
router.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/login');
  });
module.exports = router;