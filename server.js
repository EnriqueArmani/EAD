const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const methodOverride  = require("method-override");
var db
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
app.use(express.static(__dirname + '/views'));
app.use(methodOverride('_method'));
app.use('/scripts', express.static(__dirname + '/node_modules/tinymce/'));
var $ = jQuery = require('jquery')(window);

MongoClient.connect('mongodb://eadusr:eadusrdbtest@ds229918.mlab.com:29918/ead', (err, client) => {
var ObjectID = require('mongodb').ObjectID;
    if (err) return console.log(err);
    db = client.db('ead');
    app.listen(3000, () =>{
        console.log('listening on 3000');
   

    });
    
    // View Engine Currently EJS
    app.set('view engine', 'ejs');
    // Include BodyParser(remove later)
    app.use(bodyParser.urlencoded({extended: true}))
    // Render Views
    app.get('/', (req, res) => {
        db.collection('posts').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('index', {
                posts: result
            })
        })
    })
   //Render New Post Admin 
    app.get('/admin/blog/newpost', function(req, res) {
        res.render('newblogpost');
    });
    app.get('/admin/blog', function(req, res) {
        db.collection('posts').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('blogs', {
                posts: result
            })
        })
    });
    // blog post
    // blog post
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
    // Create Blog post on form submit
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
app.delete('/posts/delete', (req, res) => {
  db.collection('posts').findOneAndDelete({_id: ObjectID},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'Post deleted'})
  })
})
});