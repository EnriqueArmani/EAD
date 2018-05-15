var express = require('express');
var router = express.Router();



/**********************************************************
 *                                                         *
 *                          Pages                          *
 *                                                         *
 **********************************************************/



/*****************************
 *                            *
 *      Render Page List      *
 *                            *
 *****************************/
router.get('/pages', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    db.collection('pages').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('admin/pages', {
            pages: result
        })
    })
});


/*****************************
 *                            *
 *    Render Page Creation    *
 *                            *
 *****************************/
router.get('/pages/newpage', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    res.render('admin/newpage');
});


/*****************************
 *                            *
 *    Render Page Editing     *
 *                            *
 *****************************/
router.get('/pages/:pageSlug', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    // find the page in the `pages` array 

    db.collection('pages').find().toArray((err, result) => {
        var page = result.filter((page) => {
            return page.id == req.params._id
        })[0]
        console.log(page);

        // render the `page.ejs` individual elements

        res.render('admin/pageedit', {
            pageTitle: page.pageTitle,
            pageContent: page.pageContent,
            pageSlug: page.pageSlug,
            
        })
    })
})


/*****************************
 *                            *
 *       Post New Page        *
 *                            *
 *****************************/
router.post('/pages', (req, res) => {
    db.collection('pages').save(req.body, (err, results) => {
        if (err) return console.log(err);
        console.log('saved to database');
        //Create Slugs for URL from Page Title
        db.collection('pages')
            .findOneAndUpdate({
                    "pageSlug": {
                        $eq: ""
                    }
                }, {
                    $set: {
                        pageSlug: req.body.pageTitle.replace(/\s+/g, '-')
                    }
                }, {
                },
                (err, result) => {
                    if (err) return res.send(err)
                })
        res.redirect('admin/pages');
    })
});


/*****************************
 *                            *
 *     Edit Page Request      *
 *                            *
 *****************************/
router.put('/pages/update', (req, res) => {
    db.collection('pages')
        .findOneAndUpdate({
            _id: ObjectID
        }, {
            $set: {
                pageTitle: req.body.pageTitle,
                pageContent: req.body.pageContent,
                pageSlug: req.body.pageSlug,
            }
        }, {
            upsert: true
        }, (err, result) => {
            if (err) return res.send(err)
            res.redirect('/admin/pages')
        })
})


/*****************************
 *                            *
 *    Delete Page Request     *
 *                            *
 *****************************/
router.delete('/pages/delete', (req, res) => {
    db.collection('pages').findOneAndDelete({
            _id: ObjectID
        },
        (err, result) => {
            if (err) return res.send(500, err)
            res.send({
                message: 'page deleted'
            })
        })
})



/**********************************************************
 *                                                         *
 *                       Blog Posts                        *
 *                                                         *
 **********************************************************/



/*****************************
 *                            *
 *      Render Post List      *
 *                            *
 *****************************/
router.get('/posts', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    db.collection('posts').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('admin/posts', {
            posts: result
        })
    })
});


/*****************************
 *                            *
 *    Render Post Creation    *
 *                            *
 *****************************/
router.get('/posts/newpost', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {
    db.collection('posts').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('admin/newpost', {
            posts: result
        })
    })
});


/*****************************
 *                            *
 *    Render Post Editing     *
 *                            *
 *****************************/
router.get('/posts/:postSlug', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {

    // find the post in the `posts` array 

    db.collection('posts').find().toArray((err, result) => {
        var post = result.filter((post) => {
            return post.id == req.params._id
        })[0];
        var categories = []
        for(var i=0; i > result.length; i++){
                for(var j=0;j>result[i].postCategories.length;j++){
                    categories.push(postCategories[j])
                }
            }
        categories = categories.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });
        console.log(post);
        console.log(categories);
        console.log(result[i].postCategories[j])
        // render the `post.ejs` template with the post content
        res.render('admin/postedit', {
            postTitle: post.postTitle,
            postContent: post.postContent,
            postSlug: post.postSlug,
            categories: categories,
        })
    })
})


/*****************************
 *                            *
 *       Post New Entry       *
 *                            *
 *****************************/
router.post('/posts', (req, res) => {
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
router.put('/posts/update', (req, res) => {
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
router.delete('/posts/delete', (req, res) => {
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
