/**
 * Import node-fetch to perform API calls from the server
 */
const fetch = require('node-fetch')

/**
 * Create object with API base URLs and endpoints
 */
let apiInfo = {
    'geonames_base_url': 'http://api.geonames.org/postalCodeSearchJSON?maxRows=1&placename=',
    'weatherbit_fcast_base_url': 'https://api.weatherbit.io/v2.0/forecast/daily?units=I&key=',
    'weatherbit_curr_base_url': 'https://api.weatherbit.io/v2.0/current?units=I&key=',
    'pixabay_base_url': 'https://pixabay.com/api/?image_type=photo&category=travel&safesearch=true&key='
};

/**
 * Async function for making API calls
 */
const makeAsyncAPICall = async(url='') => {
    const request = await fetch(url);
    try {
        const data = await request.json();
        return data;
    } catch (error) {
        console.log('error: ', error)
    }
}

/**
 * Async function that uses the makeAsyncAPICall() async function to make the GeoNames API call,
 * parse the results and return the relevant info for this project.
 * If GeoNames didn't return a result, the the 'ok' key will be set to "false" for the client.
 */
async function getCoordinates(url='') {
    const geoNamesData = await makeAsyncAPICall(url);
    if (geoNamesData['postalCodes'].length > 0)  
        return {
            'ok': true,
            'country': geoNamesData['postalCodes'][0]['countryCode'],
            'lat': geoNamesData['postalCodes'][0]['lat'],
            'lng': geoNamesData['postalCodes'][0]['lng'],
            'place': geoNamesData['postalCodes'][0]['placeName']
        };
    else 
        return {
            'ok': false
        };
}

/**
 * Async function that uses the makeAsyncAPICall() async function to make an API call to the 
 * WeatherBit Forecast API endpoint. The results are parsed into an object containing an 
 * array of objects, one object per day
 */
async function getWeatherForecast(url='') {
    const weatherFcast = await makeAsyncAPICall(url);
    let data = [];
    weatherFcast['data'].forEach(function(daily_data) {
        data.push({
            'day': daily_data['datetime'],
            'low': daily_data['low_temp'],
            'high': daily_data['high_temp'],
            'icon': daily_data['weather']['icon']
        });
    });
    return {'weatherData': data};
}

/**
 * Async function that uses the makeAsyncAPICall() async function to make an API call to the 
 * WeatherBit Current Weather API endpoint. The results are parsed into an object containing an 
 * array of a single object.
 */
async function getWeatherCurrent(url='') {
    const weatherCurr = await makeAsyncAPICall(url);
    return {
        'weatherData': [{
            'temp': weatherCurr['data'][0]['temp'],
            'icon': weatherCurr['data'][0]['weather']['icon']
        }]
    }
}

/**
 * Async function that uses the makeAsyncAPICall() async function to make an API call to the 
 * Pixabay API endpoint. The results are parsed and the webformatURL is returned in an object
 * to the caller. If no image was found, the "ok" key will be set to "false".
 */
async function getPlaceImage(url='') {
    const imgData = await makeAsyncAPICall(url);
    if (imgData['hits'].length < 1)
        return {'imgData': {
            'ok': false,
            'img': null
        }};
    return {'imgData': {
        'ok': true,
        'img': imgData['hits'][0]['webformatURL']
    }};
}

/**
 * Export the functions and objects
 */
module.exports = { getCoordinates, apiInfo, getWeatherForecast, getWeatherCurrent, getPlaceImage}