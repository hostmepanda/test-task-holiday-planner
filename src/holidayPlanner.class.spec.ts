import { HolidayPlanner } from './holidayPlanner.class';

describe('HolidayPlanner class', function () {
  let holidayPlanner;

  describe('Instance creation', function () {
    beforeAll(() => {
      holidayPlanner = new HolidayPlanner();
    });

    afterAll(() => {
      holidayPlanner = null;
    });

    it('Should have timeSpan prop', () => {
      expect(holidayPlanner).toHaveProperty('timeSpan');
    });
    it('Should have country prop', () => {
      expect(holidayPlanner).toHaveProperty('country');
    });
    it('Should set country prop to FIN', () => {
      expect(holidayPlanner.country).toEqual('FIN');
    });
    it('timeSpan prop should be undefined', () => {
      expect(holidayPlanner.timeSpan).toEqual(undefined);
    });
  });
  describe('Method: set timeSpan', () => {
    describe('With valid time span', function () {
      const validTimeSpan = '11.1.2022 - 30.1.2022';

      beforeAll(() => {
        holidayPlanner = new HolidayPlanner();
        holidayPlanner.timeSpan = validTimeSpan;
      });

      afterAll(() => {
        holidayPlanner = null;
      });

      it('Should set time span', () => {
        expect(holidayPlanner.timeSpan).toEqual(validTimeSpan);
      });
    });
    describe('Time span length', function () {
      describe('Greater than 50 days', function () {
        const timeSpan51Days = '1.8.2022 - 21.9.2022';
        let validationError: Partial<Error>;

        beforeAll(() => {
          try {
            holidayPlanner = new HolidayPlanner();
            holidayPlanner.timeSpan = timeSpan51Days;
          } catch (error: unknown) {
            validationError = error;
          }
        });

        afterAll(() => {
          holidayPlanner = null;
        });

        it('Should throw validation error', () => {
          expect(validationError?.message).toEqual('The maximum length of the time span is 50 days');
        });
        it('Should NOT set time span prop', () => {
          expect(holidayPlanner.timeSpan).toEqual(undefined);
        });
      });
      describe('Less than 50 days same year', function () {
        const timeSpanLess50Days = '1.8.2022 - 21.8.2022';
        let validationError: Partial<Error>;

        beforeAll(() => {
          try {
            holidayPlanner = new HolidayPlanner();
            holidayPlanner.timeSpan = timeSpanLess50Days;
          } catch (error: unknown) {
            validationError = error;
          }
        });

        afterAll(() => {
          holidayPlanner = null;
        });

        it('Should NOT throw validation error', () => {
          expect(validationError).toEqual(undefined);
        });
        it('Should set time span prop with time span', () => {
          expect(holidayPlanner.timeSpan).toEqual(timeSpanLess50Days);
        });
      });
      describe('Less than 50 days with year change', function () {
        const timeSpanLess50Days = '13.12.2021 - 31.1.2022';
        let validationError: Partial<Error>;

        beforeAll(() => {
          try {
            holidayPlanner = new HolidayPlanner();
            holidayPlanner.timeSpan = timeSpanLess50Days;
          } catch (error: unknown) {
            validationError = error;
          }
        });

        afterAll(() => {
          holidayPlanner = null;
        });

        it('Should NOT throw validation error', () => {
          expect(validationError).toEqual(undefined);
        });
        it('Should set time span prop with time span', () => {
          expect(holidayPlanner.timeSpan).toEqual(timeSpanLess50Days);
        });
      });
    });
    describe('Time span within holiday period', function () {
      const timeSpanInHolidayPeriod = '11.12.2021 - 15.1.2022';

      beforeAll(() => {
        holidayPlanner = new HolidayPlanner();
        holidayPlanner.timeSpan = timeSpanInHolidayPeriod;
      });

      afterAll(() => {
        holidayPlanner = null;
      });

      it('Should set time span', () => {
        expect(holidayPlanner.timeSpan).toEqual(timeSpanInHolidayPeriod);
      });
    });
    describe('Time span outside holiday period', function () {
      const timeSpanOutsideHolidayPeriod = '20.3.2022 - 20.4.2022';
      let validationError: Partial<Error>;

      beforeAll(() => {
        holidayPlanner = new HolidayPlanner();

        try {
          holidayPlanner.timeSpan = timeSpanOutsideHolidayPeriod;
        } catch (error: unknown) {
          validationError = error;
        }
      });

      afterAll(() => {
        holidayPlanner = null;
      });

      it('Should throw outside holiday period error', () => {
        expect(validationError.message).toEqual(
          'Time span has to be within the same holiday period that begins on the 1st\n' +
          'of April and ends on the 31st of March.',
        );
      });
      it('Should NOT set time span property', () => {
        expect(holidayPlanner.timeSpan).toEqual(undefined);
      });
    });
  });

  describe('Method: getConsumedHolidayDays', () => {
    describe('Valid time span', () => {
      describe('5 working days, no holidays within the period', function () {
        const expectedConsumedDays = 5;

        beforeAll(() => {
          holidayPlanner = new HolidayPlanner();
          holidayPlanner.timeSpan = '18.7.2022 - 22.7.2022';
        });
        afterAll(() => {
          holidayPlanner = null;
        });
        it(`Should return ${expectedConsumedDays} day(s)`, () => {
          expect(holidayPlanner.getConsumedHolidayDays()).toEqual(expectedConsumedDays);
        });
      });
      describe('7 calendar days, no holidays within the period', function () {
        const expectedConsumedDays = 6;

        beforeAll(() => {
          holidayPlanner = new HolidayPlanner();
          holidayPlanner.timeSpan = '18.7.2022 - 24.7.2022';
        });
        afterAll(() => {
          holidayPlanner = null;
        });
        it(`Should return ${expectedConsumedDays} day(s)`, () => {
          expect(holidayPlanner.getConsumedHolidayDays()).toEqual(expectedConsumedDays);
        });
      });
      describe('14 calendar days, no holidays within the period', function () {
        const expectedConsumedDays = 12;

        beforeAll(() => {
          holidayPlanner = new HolidayPlanner();
          holidayPlanner.timeSpan = '18.7.2022 - 31.7.2022';
        });
        afterAll(() => {
          holidayPlanner = null;
        });
        it(`Should return ${expectedConsumedDays} day(s)`, () => {
          expect(holidayPlanner.getConsumedHolidayDays()).toEqual(expectedConsumedDays);
        });
      });
      describe('5 working days, 1 holiday NOT on a Sunday within the period', function () {
        const expectedConsumedDays = 4;

        beforeAll(() => {
          holidayPlanner = new HolidayPlanner();
          holidayPlanner.timeSpan = '23.5.2022 - 27.5.2022';
        });
        afterAll(() => {
          holidayPlanner = null;
        });
        it(`Should return ${expectedConsumedDays} day(s)`, () => {
          expect(holidayPlanner.getConsumedHolidayDays()).toEqual(expectedConsumedDays);
        });
      });
      describe('7 calendar days, 2 holidays within the period', function () {
        const expectedConsumedDays = 5;

        beforeAll(() => {
          holidayPlanner = new HolidayPlanner();
          holidayPlanner.timeSpan = '23.6.2022 - 30.6.2022';
        });
        afterAll(() => {
          holidayPlanner = null;
        });
        it(`Should return ${expectedConsumedDays} day(s)`, () => {
          expect(holidayPlanner.getConsumedHolidayDays()).toEqual(expectedConsumedDays);
        });
      });
      describe('4 calendar days, 2 holidays and Sunday within the period', function () {
        const expectedConsumedDays = 1;

        beforeAll(() => {
          holidayPlanner = new HolidayPlanner();
          holidayPlanner.timeSpan = '15.4.2022 - 18.4.2022';
        });
        afterAll(() => {
          holidayPlanner = null;
        });
        it(`Should return ${expectedConsumedDays} day(s)`, () => {
          expect(holidayPlanner.getConsumedHolidayDays()).toEqual(expectedConsumedDays);
        });
      });
      describe('4 calendar days, 1 holiday which is Sunday within the period', function () {
        const expectedConsumedDays = 3;

        beforeAll(() => {
          holidayPlanner = new HolidayPlanner();
          holidayPlanner.timeSpan = '3.6.2022 - 6.6.2022';
        });
        afterAll(() => {
          holidayPlanner = null;
        });
        it(`Should return ${expectedConsumedDays} day(s)`, () => {
          expect(holidayPlanner.getConsumedHolidayDays()).toEqual(expectedConsumedDays);
        });
      });
    });
  });
});