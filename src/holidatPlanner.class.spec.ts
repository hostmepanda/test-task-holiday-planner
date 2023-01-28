import { HolidayPlanner } from './holidayPlanner.class';

describe('HolidayPlanner class', function () {
  const holidayPlanner = new HolidayPlanner('1.7.2021 - 29.7.2021');

  it('Instance should contain attributes', () => {
    expect(holidayPlanner).toHaveProperty('timeSpan');
  });

});