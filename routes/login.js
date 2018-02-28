var express = require('express');
var router = express.Router();
const passport = require('passport')

// Render post

       // Render post Admin
    router.get('/login', function(req, res) {
        db.collection('posts').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('admin/posts', {
                posts: result
            })
        })
    });
module.exports = router;