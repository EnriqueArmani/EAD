var express = require('express');
var posts = require('../routes/posts');
var admin = require('../routes/admin');
var login = require('../routes/login')
var router = express.Router();

router.use('/posts', posts);
router.use('/admin', admin);
router.use('/login', login);

module.exports = router;