var path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mockAPIResponse = require('./mockAPI.js')
const app = express()

const dotenv = require('dotenv').config({path: path.join(__dirname, '../../.env')});
const parsed_env = dotenv.parsed;

app.use(express.static('dist'))

console.log(__dirname)

console.log(parsed_env.GEONAMES_USERNAME)


app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
    // res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})

app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})
