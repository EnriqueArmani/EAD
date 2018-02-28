var express = require('express');
var router = express.Router();

// Render Posts
    router.get('/', (req, res) => {
        db.collection('posts').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('index', {
                posts: result
            })
        })
    })
    
    //Render Single Post
    router.get('/:postSlug', (req, res) => {
        // find the post in the `posts` array 
        db.collection('posts').find().toArray((err, result) => {   
            var post = result.filter((post) => {
                return post.id == req.params._id
            })[0]
            console.log(post);
            // render the `post.ejs` template with the post content
            res.render('theme/posts', {
                postTitle: post.postTitle,
                postContent: post.postContent,
                 postSlug: post.postSlug,
            })
        })
    })

  
module.exports = router;