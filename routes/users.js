const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Redirect to login page when user not logged in
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); 
    } else {
        next(); // move to next middleware function
    }
}

// Redirect to home page when user logged in
const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/'); 
    } else {
        next();
    }
}

router.get('/register', redirectHome, (req, res, next) => {
    res.render('register.ejs');                                                             
})    

// Create validation chains for register page fields
registerValidation = [check('email').isEmail().isLength({max: 100}), 
               check('username').isLength({min: 1, max: 50}),
               check('password').isLength({min: 8, max: 50}),
               check('first').isLength({min: 1, max: 50}),
               check('last').isLength({min: 1, max: 50})]

router.post('/registered', registerValidation, redirectHome, (req, res, next) => {
    // check validation of fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) { // reload the page if any field has an error
        res.redirect('./register');
        return;
    }
    // save new user data in database
    const plainPassword = req.body.password;
    // encrypt user's password using bcrypt hashing algorithm
    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
        let sqlquery = `INSERT INTO users
                        (username, hashedPassword, firstName, lastName, email) 
                        VALUES (?,?,?,?,?)`
        // sanitize username, first name, and last name fields
        req.body.username = req.sanitize(req.body.username);
        req.body.first = req.sanitize(req.body.first);
        req.body.last = req.sanitize(req.body.last);
        // create record for query
        let newrecord = [req.body.username, hashedPassword, req.body.first,
                         req.body.last, req.body.email];
        db.query(sqlquery, newrecord, (err, result) => { // execute sql query
            if (err) { // error handling
                next(err);
                return;
            }
            // if no errors, send success message
            result = `Hello ${req.body.first} ${req.body.last} you are now registered!  
                      We will send an email to you at ${req.body.email} Your password is: ${plainPassword} 
                      and your hashed password is: ${hashedPassword}`;
            res.send(result);
        })
    });                                                                      
})

router.get('/login', (req, res, next) => {
    res.render('login.ejs');                                                        
})

router.post('/loggedin', (req, res, next) => {
    // query database to find a username matching the input, and get the hashed password
    req.body.username = req.sanitize(req.body.username); // sanitize username
    let sqlquery = `SELECT hashedPassword FROM users WHERE username = '${req.body.username}'`
    db.query(sqlquery, (err, result) => { // execute sql query
        // error handling
        if (err) next(err); // move to next middleware function
        if (result.length == 0) { // send error message when no match found
            res.send('Error: user not found');
            return;
        }
        // if matching username found in database
        let hashedPw = result[0].hashedPassword;
        // compare hashed input to hashed password of user in database
        bcrypt.compare(req.body.password, hashedPw, (err, result) => {
            if (err) next(err);
            if (result) { // passwords match, log user in and redirect to home
                req.session.userId = req.body.username;
                res.redirect('/');
            } else { // passwords don't match, send error message
                res.send('Error: Incorrect password');
            }
        })
    })
});  

router.get('/logout', redirectLogin, (req, res) => {
    // destroy current session to log user out
    req.session.destroy(err => {
        return res.redirect('/'); 
    })
})

router.get('/list', redirectLogin, (req, res, next) => {
    let sqlquery = 'SELECT * FROM users' // query database to get all users
    db.query(sqlquery, (err, result) => { // execute sql query
        if (err) next(err); // error handling
        res.render('userlist.ejs', {users:result});
     })
})

// Export the router object so index.js can access it
module.exports = router;