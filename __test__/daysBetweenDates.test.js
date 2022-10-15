const { daysBetweenDates } = require('../src/client/js/app');

describe("Testing if trip date is in the past ", () => {
    test("Testing the isDateValid() function", () => {
        expect(daysBetweenDates(new Date('2022-03-01'), new Date('2022-03-03'))).toBe(2);
    })
})