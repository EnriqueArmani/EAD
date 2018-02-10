const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var db


MongoClient.connect('mongodb://eadusr:eadusrdbtest@ds229918.mlab.com:29918/ead', (err, client) => {
    if (err) return console.log(err);
    db = client.db('ead');
    app.listen(3000, () =>{
        console.log('listening on 3000');
    });

app.use(bodyParser.urlencoded({extended: true}))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});
app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, results) => {
        if (err) return console.log(err);
        console.log('saved to database');
        res.redirect('/');
    })
});
app.get('/', (req, res) => {
    var cursor = db.collection('quotes').find();
}); 
db.collection('quotes').find().toArray((err, results) => {
    console.log(results);
})
    });