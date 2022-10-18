var path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
// import functions for API calls
const { getCoordinates, apiInfo, getWeatherForecast, getWeatherCurrent, getPlaceImage} = require('./api.js')

/**
 * Setup empty JS object to act as endpoint for project data. 
 * This can be used to extend the project further by allowing multiple trips
 */
let projectData = {};

// read the .env file with API keys and usernames
const dotenv = require('dotenv').config({path: path.join(__dirname, '../../.env')})
const parsed_env = dotenv.parsed

// instantiate the server
const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

console.log(__dirname)

// entry point HTML
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
    // res.sendFile(path.resolve('src/client/views/index.html'))
})

// Start the production server on port 8081
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

// GET route to retrieve the project data
app.get('/getTrip', (req, res) => {
    console.log('GET/getTrip received');
    // console.log(projectData);
    res.send(projectData);
})

// POST route the add trip information
/**
 * The following route will make all the API calls using promises
 */
app.post('/addTrip', function(req, res) {
    console.log('POST/addTrip received');
    // first make the GeoNames API call
    getCoordinates(apiInfo.geonames_base_url + `${req.body.destination}&username=${parsed_env.GEONAMES_USERNAME}`)
    .then(function(data) {
        projectData['geoData'] = data;
        if (!data.ok) {
            // No result returned from GeoNames API, return results client
            res.status(200).send(JSON.stringify('OK'));
        }
        if (req.body.days_to_trip <= 7)
            // trip is within a week, return current weather info
            return getWeatherCurrent(apiInfo.weatherbit_curr_base_url + `${parsed_env.WEATHERBIT_API_KEY}&lat=${data.lat}&lon=${data.lng}`);
        else
            // trip is more than 7 days away but within 16 weeks
            return getWeatherForecast(apiInfo.weatherbit_fcast_base_url + `${parsed_env.WEATHERBIT_API_KEY}&lat=${data.lat}&lon=${data.lng}`);
    })
    .then(function(data) {
        projectData['weatherData'] = data['weatherData'];  
        // get an image. Replace spaces in the query string with "+"
        return getPlaceImage(apiInfo.pixabay_base_url + `${parsed_env.PIXABAY_API_KEY}&q=${req.body.destination.replace(/\s/g, '+')}`);
    })
    .then(function(data) {
        projectData['imgData'] = data['imgData'];
        // finally, send OK status to client
        res.status(200).send(JSON.stringify('OK'));
    })
})