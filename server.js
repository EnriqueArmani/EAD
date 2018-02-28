const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
const app = express();
const methodOverride  = require("method-override");
var mongourl = 'mongodb://eadusr:eadusrdbtest@ds229918.mlab.com:29918/ead'
var path = require('path')
global.db = mongourl;
var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
app.use('', express.static('public'))
app.set('views',[path.join(__dirname, 'views'),
                path.join(__dirname, 'views/admin'),
                path.join(__dirname, 'views/theme')]);


app.use(methodOverride('_method'));
app.use('/scripts', express.static(__dirname + '/node_modules/tinymce/'));
var $ = jQuery = require('jquery')(window);


//Connect to MongoDB 

MongoClient.connect( mongourl, (err, client) => {
    
    //Object ID variable to connect to Current Document In Put Requests
    var ObjectID = require('mongodb').ObjectID;
    if (err) return console.log(err);
    
    //Database Variable and Server Start
    db = client.db('ead');
    
    app.listen(3000, () =>{
        console.log('listening on 3000');
    });
    
    // View Engine Currently EJS
    app.set('view engine', 'ejs');
    
    // Include BodyParser(remove later)
    app.use(bodyParser.urlencoded({extended: true}))
    var routes= require('./routes');
    app.use('/', routes);
    
app.use(passport.initialize())
app.use(passport.session())
 
});