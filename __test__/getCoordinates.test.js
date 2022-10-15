const { getCoordinates, apiInfo } = require('../src/server/api');
var path = require('path');

const dotenv = require('dotenv').config({path: path.join(__dirname, '../.env')});
const parsed_env=dotenv.parsed;

describe("Testing the GeoNames API call.", () => {
    test("Testing the getCoordinates() function", () => {
        const api_url = apiInfo.geonames_base_url + `Orlando&username=${parsed_env.GEONAMES_USERNAME}`;
        return getCoordinates(api_url)
        .then(data => {
            expect(data).toMatchObject({place: 'Orlando', country: 'US'})
        });
    })
})