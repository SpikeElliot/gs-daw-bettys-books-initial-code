// Create a new router
const express = require('express');
const router = express.Router();
//Import request module for APIs
const request = require('request');

router.get('/', (req, res, next) => {
    res.render('tvshows.ejs');
})

router.get('/search_result', (req, res, next) => {
    let tvshow = req.query.tvshow; // show user entered on search page
    let url = `https://api.tvmaze.com/search/shows?q=${tvshow}`;
    // Call TVMaze API to search for queried show
    request(url, (err, response, body) => {
        if (err) { // error handling
            next(err); // execute next middleware function
            return;
        }
        let shows = JSON.parse(body); // put JSON data into shows object
        if (shows == undefined || shows[0] == undefined) {
            // Error handler for API not returning any shows for search term
            res.send('Error: no matching show found');
            return;
        }
        let showTitle = shows[0].show.name;
        url = `https://api.tvmaze.com/shows/${shows[0].show.id}/episodes`;
        // Call TVMaze API again to get episode list for searched show
        request(url, (err, response, body) => {
            if (err) { // error handling
                next(err); // execute next middleware function
                return;
            }
            let episodes = JSON.parse(body); // put JSON data into episodes object
            // Render episode list page using JSON data
            res.render('episodes.ejs', {episodes, showTitle});
        })
    });
})

// Export the router object so index.js can access it
module.exports = router;