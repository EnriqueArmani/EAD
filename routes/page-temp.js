// Render post

       // Render post Admin
    router.get('/posts', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        db.collection('posts').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('admin/posts', {
                posts: result
            })
        })
    });
    // Render post Creation
    router.get('admin/posts/newpost', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        res.render('admin/newpost');
    });
    
    // Render Edit post
    router.get('/posts/:postSlug', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        // find the post in the `posts` array 
        db.collection('posts').find().toArray((err, result) => {   
            var post = result.filter((post) => {
                return post.id == req.params._id
            })[0]
            console.log(post);
            // render the `post.ejs` template with the post content
            res.render('admin/postedit', {
                postTitle: post.postTitle,
                postContent: post.postContent,
                postSlug: post.postSlug,
                
            })
        })
    })
    
   

// post Posting Function
    router.post('/posts', (req, res) => {
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
                res.redirect( 'admin/posts');
            })
        });
    
    // post Updating Function
    router.put('/posts/update', (req, res) => {
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
        res.redirect('/admin/posts')
      })
    })
    
    //post Deletion Function
    router.delete('/posts/delete', (req, res) => {
      db.collection('posts').findOneAndDelete({_id: ObjectID},
      (err, result) => {
        if (err) return res.send(500, err)
        res.send({message: 'Post deleted'})
      })
    })