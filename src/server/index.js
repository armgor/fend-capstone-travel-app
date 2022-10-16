var path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
// import functions for API calls
const { getCoordinates, apiInfo, getWeatherForecast, getWeatherCurrent, getPlaceImage} = require('./api.js')

// read the .env file with API keys and usernames
const dotenv = require('dotenv').config({path: path.join(__dirname, '../../.env')})
const parsed_env = dotenv.parsed

const app = express()
app.use(express.static('dist'))
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

console.log(__dirname)


app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
    // res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8081, function () {
    console.log('Example app listening on port 8081!')
})

app.post('/addTrip', function(req, res) {
    let outData = {}
    getCoordinates(apiInfo.geonames_base_url + `${req.body.destination}&username=${parsed_env.GEONAMES_USERNAME}`)
    .then(function(data) {
        outData['geoData'] = data;
        if (!data.ok) {
            // No result returned from GeoNames API
            res.send(outData);
        }
        if (req.body.days_to_trip <= 7)
            // trip is within a week, return current weather info
            return getWeatherCurrent(apiInfo.weatherbit_curr_base_url + `${parsed_env.WEATHERBIT_API_KEY}&lat=${data.lat}&lon=${data.lng}`);
        else
            // trip is more than 7 days away but within 16 weeks, get future forecast
            return getWeatherForecast(apiInfo.weatherbit_fcast_base_url + `${parsed_env.WEATHERBIT_API_KEY}&lat=${data.lat}&lon=${data.lng}`);
    })
    .then(function(data) {
        outData['weatherData'] = data['weatherData'];
        console.log(apiInfo.pixabay_base_url + `${parsed_env.PIXABAY_API_KEY}&q=${req.body.destination.replace(/\s/g, '+')}`)
        return getPlaceImage(apiInfo.pixabay_base_url + `${parsed_env.PIXABAY_API_KEY}&q=${req.body.destination.replace(/\s/g, '+')}`);
    })
    .then(function(data) {
        outData['imgData'] = data['imgData'];
        res.send(outData);
    })
})
