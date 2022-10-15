var path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
// import functions for API calls
const { getCoordinates, apiInfo } = require('./api.js')

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
    getCoordinates(apiInfo.geonames_base_url + `${req.body.destination}&username=${parsed_env.GEONAMES_USERNAME}`).
    then(function(data) {
        res.send(data)
    })
})
