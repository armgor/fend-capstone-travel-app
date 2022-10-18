const { getClosestIndex } = require('../src/client/js/app');

describe("Testing function to find closest match in array ", () => {
    test("Testing the getClosestIndex() function", () => {
        let dateStrArray = ['2022-01-03', '2022-01-04', '2022-01-05', '2022-01-06', '2022-01-07'];
        let dateStrToCompare = '2022-01-06';
        expect(getClosestIndex(dateStrArray, dateStrToCompare)).toBe(3);
    })
})