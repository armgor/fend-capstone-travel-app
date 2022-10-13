/**
 * Import node-fetch to perform API calls from the server
 */
const fetch = require('node-fetch')

/**
 * Create object with API base URLs and endpoints
 */
apiInfo = {
    'geonames_base_url': 'http://api.geonames.org/postalCodeSearchJSON?maxRows=10&placename='
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
    // console.log(geoNamesData);
    return geoNamesData;
}


module.exports = { getCoordinates, apiInfo }