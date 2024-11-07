// Create a new router
const express = require('express');
const router = express.Router();
//Import request module for APIs
const request = require('request');

router.get('/', (req, res, next) => {
    res.render('weather.ejs');
})

router.get('/search_result', (req, res, next) => {
    let apiKey = '7458f3eb3f8b8909cfa153de1baa1130';
    let city = req.query.city; // city user entered on search page
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    // Call weather API to get forecast for searched city
    request(url, (err, response, body) => {
        if (err) { // error handling
            next(err); // execute next middleware function
            return;
        }
        let weather = JSON.parse(body); // put JSON data into weather object
        if (weather == undefined || weather.main == undefined) {
            // Error handler for API not returning forecast for searched city
            res.send('Error: no city found');
            return;
        }
        // Send message with forecast information from JSON data
        let wmsg = `<h1> ${weather.name} Weather </h1>
                    <p> Temperature: ${weather.main.temp} degrees </p>
                    <p> Humidity: ${weather.main.humidity}% </p>
                    <p> Air pressure: ${weather.main.pressure} hPa </p>
                    <p> Wind speed: ${weather.wind.speed} knots </p>
                    <p> Description: ${weather.weather[0].description} </p>`;
        res.send(wmsg);
    });
})

// Export the router object so index.js can access it
module.exports = router;