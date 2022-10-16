const { getWeatherForecast, apiInfo } = require('../src/server/api');
var path = require('path');

const dotenv = require('dotenv').config({path: path.join(__dirname, '../.env')});
const parsed_env=dotenv.parsed;

describe("Testing the WeatherBit Weather Forecast API call.", () => {
    test("Testing the getWeatherForecast() function", () => {
        const api_url = apiInfo.weatherbit_fcast_base_url + `${parsed_env.WEATHERBIT_API_KEY}&lat=36.697&lon=-96.787`;
        return getWeatherForecast(api_url)
        .then(data => {
            expect(data).toHaveProperty('weatherData')
        });
    })
})