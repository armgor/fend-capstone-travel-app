const { padToDigits } = require('../src/client/js/app');

describe("Testing the number padder ", () => {
    test("Testing the padToDigits() function", () => {
        expect(padToDigits(2, 2)).toBe('02');
        expect(padToDigits(3, 4)).toBe('0003');
    })
})