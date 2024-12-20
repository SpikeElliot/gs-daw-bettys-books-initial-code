// Create a new router
const express = require('express');
const router = express.Router();

// Handle our routes
router.get('/', (req, res, next) => {
    res.render('index.ejs', {userId:req.session.userId});
})

router.get('/about', (req, res, next) => {
    res.render('about.ejs');
})

// Export the router object so index.js can access it
module.exports = router;