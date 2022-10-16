const { getPlaceImage, apiInfo } = require('../src/server/api');
var path = require('path');

const dotenv = require('dotenv').config({path: path.join(__dirname, '../.env')});
const parsed_env=dotenv.parsed;

describe("Testing the Pixabay API call.", () => {
    test("Testing the getPlaceImage() function", () => {
        const api_url = apiInfo.pixabay_base_url + `${parsed_env.PIXABAY_API_KEY}&q=Orlando`;
        return getPlaceImage(api_url)
        .then(data => {
            expect(data).toHaveProperty('imgData.img')
        });
    })
})