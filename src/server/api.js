/**
 * Import node-fetch to perform API calls from the server
 */
const fetch = require('node-fetch')

/**
 * Create object with API base URLs and endpoints
 */
let apiInfo = {
    'geonames_base_url': 'http://api.geonames.org/postalCodeSearchJSON?maxRows=1&placename='
}

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


module.exports = { getCoordinates, apiInfo }