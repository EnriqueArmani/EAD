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

/*****************************
 *                            *
 *       Post New Entry       *
 *                            *
 *****************************/
router.post('/', (req, res) => {
    db.collection('posts').save(req.body, (err, results) => {
        if (err) return console.log(err);
        console.log('saved to database');

        //Create Slugs for URL from Page Title
        db.collection('posts')
            .findOneAndUpdate({
                    "postSlug": {
                        $eq: ""
                    }
                }, {
                    $set: {
                        postSlug: req.body.postTitle.replace(/\s+/g, '-')
                    }
                }, {},
                (err, result) => {
                    if (err) return res.send(err)
                })
        res.redirect('admin/posts');
    })
});


/*****************************
 *                            *
 *     Edit Post Request      *
 *                            *
 *****************************/
router.put('/update', (req, res) => {
    db.collection('posts').findOneAndUpdate({
        _id: ObjectID
    }, {
        $set: {
            postTitle: req.body.postTitle,
            postContent: req.body.postContent,
            postSlug: req.body.postSlug,
        }
    }, {
        upsert: true
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/admin/posts')
    })
})

/*****************************
 *                            *
 *    Delete Post Request     *
 *                            *
 *****************************/
router.delete('/delete', (req, res) => {
    db.collection('posts').findOneAndDelete({
            _id: ObjectID
        },
        (err, result) => {
            if (err) return res.send(500, err)
            res.send({
                message: 'Post deleted'
            })
            res.redirect('/admin/posts')
        })
})

  
module.exports = router;