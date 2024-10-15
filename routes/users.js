// Create a new router
const express = require("express")
const bcrypt = require("bcrypt");
const saltRounds = 10;
const router = express.Router();

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./login'); // redirect to login page when user not logged in
    } else {
        next(); // move to next middleware function
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/'); // redirect to home page when user logged in
    } else {
        next(); // move to next middleware function
    }
}

router.get('/register', redirectHome, function (req, res, next) {
    res.render('register.ejs')  ;                                                             
})    

router.post('/registered', redirectHome, function (req, res, next) {
    // saving data in database
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        let sqlquery = `INSERT INTO users
                        (username, hashedPassword, firstName, lastName, email) 
                        VALUES (?,?,?,?,?)`
        let newrecord = [req.body.username, hashedPassword, req.body.first,
                         req.body.last, req.body.email];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err);
            }
            else {
                result = `Hello ${req.body.first} ${req.body.last} you are now registered!  
                We will send an email to you at ${req.body.email} Your password is: ${plainPassword} 
                and your hashed password is: ${hashedPassword}`;
                res.send(result);
            }
        })
    });                                                                      
})

router.get('/login', function (req, res, next) {
    res.render('login.ejs');                                                        
})

router.post('/loggedin', function (req, res, next) {
    // saving data in database
    let sqlquery = `SELECT hashedPassword FROM users WHERE username = '${req.body.username}'` // query database to get all the books
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        if (result.length <= 0) {
            res.send("Error: user not found");
            return;
        } 
        hashedPassword = result[0].hashedPassword;
        bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
            if (err) {
                res.send("Error: user not found");
            }
            else if (result) {
                req.session.userId = req.body.username;
                res.redirect('/');
            }
            else {
                res.send("Incorrect password");
            }
        })
    })
});  

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
        return res.redirect('/'); 
    })
})

router.get('/list', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM users" // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        }
        res.render("userlist.ejs", {users:result});
     })
})

// Export the router object so index.js can access it
module.exports = router;