const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login'); // redirect to the login page
    } else {
        next(); // move to next middleware function
    }
}

router.get('/search', redirectLogin, function(req, res, next){
    res.render('search.ejs');
})

let searchValidation = [check('search_text').notEmpty()];

router.get('/search_result', searchValidation, redirectLogin, function (req, res, next) {
    // query database to find books containing search term
    let sqlquery = `SELECT * FROM books WHERE name LIKE '%${req.query.search_text}%'`;
    db.query(sqlquery, (err, result) => { // execute sql query
        if (err) next(err); // handle errors
        res.render('list.ejs', {availableBooks:result});
     }) 
})

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = 'SELECT * FROM books'; // query database to get all the books
    db.query(sqlquery, (err, result) => { // execute sql query
        if (err) next(err); // handle errors
        res.render('list.ejs', {availableBooks:result});
     })
})

router.get('/addbook', redirectLogin, function (req, res, next) {
    res.render('addbook.ejs');
})

// Create validation chains for name and price fields
bookAddValidation = [check('name').isLength({min: 1, max: 50}),
                     check('price').notEmpty().isCurrency()]

router.post('/bookadded', bookAddValidation, redirectLogin, function (req, res, next) {
    // save book data in database
    let sqlquery = 'INSERT INTO books (name, price) VALUES (?,?)';
    req.body.name = req.sanitize(req.body.name); // sanitize book name
    let newrecord = [req.body.name, req.body.price]; // create record for query
    db.query(sqlquery, newrecord, (err, result) => { // execute sql query
        if (err) { // handle errors
            next(err);
            return;
        }
        // if no errors, send success message
        res.send(`This book is added to database, name: ${req.body.name} price: ${req.body.price}`);
    })
}) 

router.get('/bargainbooks', redirectLogin, function(req, res, next) {
    // query database to find books where price is less than 20
    let sqlquery = 'SELECT * FROM books WHERE price < 20';
    db.query(sqlquery, (err, result) => { // execute sql query
        if (err) next(err); // handle errors
        res.render('bargains.ejs', {availableBooks:result});
    })
}) 

// Export the router object so index.js can access it
module.exports = router;