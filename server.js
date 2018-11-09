const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const app = express();
const methodOverride = require("method-override");
var mongourl = 'mongodb://eadusr:eadusrdbtest@ds229918.mlab.com:29918/ead'
var path = require('path')
global.db = mongourl;
var jsdom = require('jsdom');
const assert = require('assert');
const {
    JSDOM
} = jsdom;
const {
    window
} = new JSDOM();
const {
    document
} = (new JSDOM('')).window;
global.document = document;
app.use('', express.static('public'))
app.set('views', [path.join(__dirname, 'views'),
                path.join(__dirname, 'views/admin'),
                path.join(__dirname, 'views/theme')]);


app.use(methodOverride('_method'));
app.use('/scripts', express.static(__dirname + '/node_modules/tinymce/'));
var $ = jQuery = require('jquery')(window);


//Connect to MongoDB 

MongoClient.connect(mongourl, (err, client) => {


    //Object ID variable to connect to Current Document In Put Requests
    var ObjectID = require('mongodb').ObjectID;
    if (err) return console.log(err);



    //Database Variable and Server Start
    db = client.db('ead');

    global.userlist = require('./auth');


    passport.use(new Strategy(
        (username, password, cb) => {
            userlist.users.findByUsername(username, (err, user) => {
                if (err) {
                    return cb(err);
                }
                if (!user) {
                    return cb(null, false);
                }
                bcrypt.compare(password, user.password, (err, res) => {
                    if (err) return cb(err);
                    if (res === false) {
                        return cb(null, false);
                    } else {
                        return cb(null, user);
                    }
                });
            });
        }));
    passport.serializeUser((user, cb) => {
        cb(null, user.id);
    });

    passport.deserializeUser((id, cb) => {
        userlist.users.findById(id, (err, user) => {
            if (err) {
                return cb(err);
            }
            cb(null, user);
        });
    });

    app.listen(3000, () => {
        console.log('listening on 3000');
    });


    // View Engine Currently EJS
    app.set('view engine', 'ejs');

    // Include BodyParser(remove later)
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(require('express-session')({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false
    }));

    // Initialize Passport and restore authentication state, if any, from the
    // session.
    app.use(passport.initialize());
    app.use(passport.session());
    var routes = require('./routes');
    app.use('/', routes);



});
