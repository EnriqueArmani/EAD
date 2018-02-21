var express = require('express');
var app = express();

// Render Blog
    app.get('/', (req, res) => {
        db.collection('posts').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('index', {
                posts: result
            })
        })
    })
    
    //Render Blog Posts
    app.get('/posts/:postSlug', (req, res) => {
        // find the post in the `posts` array 
        db.collection('posts').find().toArray((err, result) => {   
            var post = result.filter((post) => {
                return post.id == req.params._id
            })[0]
            console.log(post);
            // render the `post.ejs` template with the post content
            res.render('posts', {
                postTitle: post.postTitle,
                postContent: post.postContent,
                 postSlug: post.postSlug,
            })
        })
    })
    
   // Render Blog Admin
    app.get('/admin/blog', function(req, res) {
        db.collection('posts').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('blogs', {
                posts: result
            })
        })
    });
    // Render Blog Creation
    app.get('/admin/blog/newpost', function(req, res) {
        res.render('newblogpost');
    });
    
    // Render Edit Blog
    app.get('/admin/blog/:postSlug', (req, res) => {
        // find the post in the `posts` array 
        db.collection('posts').find().toArray((err, result) => {   
            var post = result.filter((post) => {
                return post.id == req.params._id
            })[0]
            console.log(post);
            // render the `post.ejs` template with the post content
            res.render('blogpostedit', {
                postTitle: post.postTitle,
                postContent: post.postContent,
                postSlug: post.postSlug,
                
            })
        })
    })
    
   

// Blog Posting Function
    app.post('/posts', (req, res) => {
            db.collection('posts').save(req.body, (err, results) => {
                if (err) return console.log(err);
                console.log('saved to database');
                    //Create Slugs for URL from Page Title
                    db.collection('posts')
                    .findOneAndUpdate({"postSlug": { $eq: "" } }, {
                        $set: {
                            postSlug: req.body.postTitle.replace(/\s+/g, '-')
                        }
                    },
                    {
                        //sort: {_id: -1},
                        //upsert: true
                    }, 
                    (err, result) => {
                        if (err) return res.send(err)
                        //res.send(result)
                    })
                res.redirect('/admin/blog');
            })
        });
    
    // Blog Updating Function
    app.put('/posts/update', (req, res) => {
      db.collection('posts')
      .findOneAndUpdate({_id: ObjectID}, {
        $set: {
            postTitle: req.body.postTitle,
            postContent: req.body.postContent,
            postSlug: req.body.postSlug,
        }
      }, {
        //sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/admin/blog')
      })
    })
    
    //Blog Deletion Function
    app.delete('/posts/delete', (req, res) => {
      db.collection('posts').findOneAndDelete({_id: ObjectID},
      (err, result) => {
        if (err) return res.send(500, err)
        res.send({message: 'Post deleted'})
      })
    })