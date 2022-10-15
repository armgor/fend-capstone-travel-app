const { isDateValid } = require('../src/client/js/app');

describe("Testing the trip date validity ", () => {
    test("Testing the isDateValid() function", () => {
        expect(isDateValid('2022-01-01')).toBe(true);
        expect(isDateValid('2022-001-01')).toBe(false);
    })
})