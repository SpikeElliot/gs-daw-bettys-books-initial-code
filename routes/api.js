const express = require('express');
const router = express.Router();

router.get('/books', function (req, res, next) {
    // query database to get all the books
    let sqlquery;
    if (req.query.search_term) {
        sqlquery = `SELECT * FROM books WHERE name LIKE '%${req.query.search_term}%'`;
    } else {
        sqlquery = 'SELECT * FROM books';
    }
    
    // execute the sql query
    db.query(sqlquery, (err, result) => {
        // return results as a JSON object
        if (err) { // error handling
            res.json(err);
            next(err); // execute next middleware function
            return;
        }
        res.json(result);
    })
})

// Export the router object so index.js can access it
module.exports = router;