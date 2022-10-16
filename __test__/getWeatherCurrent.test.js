const { getWeatherCurrent, apiInfo } = require('../src/server/api');
var path = require('path');

const dotenv = require('dotenv').config({path: path.join(__dirname, '../.env')});
const parsed_env=dotenv.parsed;

describe("Testing the WeatherBit Current Weather API call.", () => {
    test("Testing the getWeatherCurrent() function", () => {
        const api_url = apiInfo.weatherbit_curr_base_url + `${parsed_env.WEATHERBIT_API_KEY}&lat=36.697&lon=-96.787`;
        return getWeatherCurrent(api_url)
        .then(data => {
            expect(data).toHaveProperty('weatherData.icon')
        });
    })
})