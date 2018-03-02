var express = require('express');
var router = express.Router();

// Render Homepage
    router.get('/', (req, res) => {
        db.collection('pages').find().toArray((err, result) => {
            if (err) return console.log(err)
            res.render('homepage', {
                pages: result
            })
        })
    })
    
    //Render Single page
    router.get('/:pageSlug', (req, res) => {
        // find the page in the `pages` array 
        db.collection('pages').find().toArray((err, result) => {   
            var page = result.filter((page) => {
                return page.id == req.params._id
            })[0]
            console.log(page);
            // render the `page.ejs` template with the page content
            res.render('theme/page', {
                pageTitle: page.pageTitle,
                pageContent: page.pageContent,
                 pageSlug: page.pageSlug,
            })
        })
    })

  
module.exports = router;