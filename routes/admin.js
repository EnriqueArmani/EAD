var express = require('express');
var router = express.Router();
// Render page

       // Render page Admin
    router.get('/pages', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        db.collection('pages').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('admin/pages', {
                pages: result
            })
        })
    });
    // Render page Creation
    router.get('admin/pages/newpage', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        res.render('admin/newpage');
    });
    
    // Render Edit page
    router.get('/pages/:pageSlug', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
        // find the page in the `pages` array 
        db.collection('pages').find().toArray((err, result) => {   
            var page = result.filter((page) => {
                return page.id == req.params._id
            })[0]
            console.log(page);
            // render the `page.ejs` template with the page content
            res.render('admin/pageedit', {
                pageTitle: page.pageTitle,
                pageContent: page.pageContent,
                pageSlug: page.pageSlug,
                
            })
        })
    })
    
   

// page posting Function
    router.post('/pages', (req, res) => {
            db.collection('pages').save(req.body, (err, results) => {
                if (err) return console.log(err);
                console.log('saved to database');
                    //Create Slugs for URL from Page Title
                    db.collection('pages')
                    .findOneAndUpdate({"pageSlug": { $eq: "" } }, {
                        $set: {
                            pageSlug: req.body.pageTitle.replace(/\s+/g, '-')
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
                res.redirect( 'admin/pages');
            })
        });
    
    // page Updating Function
    router.put('/pages/update', (req, res) => {
      db.collection('pages')
      .findOneAndUpdate({_id: ObjectID}, {
        $set: {
            pageTitle: req.body.pageTitle,
            pageContent: req.body.pageContent,
            pageSlug: req.body.pageSlug,
        }
      }, {
        //sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/admin/pages')
      })
    })
    
    //page Deletion Function
    router.delete('/pages/delete', (req, res) => {
      db.collection('pages').findOneAndDelete({_id: ObjectID},
      (err, result) => {
        if (err) return res.send(500, err)
        res.send({message: 'page deleted'})
      })
    })











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
module.exports = router;