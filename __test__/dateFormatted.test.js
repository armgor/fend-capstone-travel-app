const { dateFormatted } = require('../src/client/js/app');

describe("Testing the date formatter ", () => {
    test("Testing the dateFormatted() function", () => {
        expect(dateFormatted('2022-01-01')).toBe('01/01/2022');
    })
})