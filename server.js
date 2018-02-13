const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var db
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

MongoClient.connect('mongodb://eadusr:eadusrdbtest@ds229918.mlab.com:29918/ead', (err, client) => {
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
            res.render('index.ejs', {posts: result})
        })
    })
    // Create Blog post on form submit
    app.post('/posts', (req, res) => {
        db.collection('posts').save(req.body, (err, results) => {
            if (err) return console.log(err);
            console.log('saved to database');
                //Create Slugs for URL from Page Title
                db.collection('posts')
                .findOneAndUpdate({}, {
                    $set: {
                        postSlug: req.body.pageTitle.replace(/\s+/g, '-')
                    }
                },
                {
                    sort: {_id: -1},
                    upsert: true
                }, 
                (err, result) => {
                    if (err) return res.send(err)
                    //res.send(result)
                })
            res.redirect('/');
        })
    });
});