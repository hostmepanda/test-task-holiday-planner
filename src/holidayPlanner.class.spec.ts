import { HolidayPlanner } from './holidayPlanner.class';

describe('HolidayPlanner class', function () {
  let holidayPlanner;

  describe('Without setting time span', function () {
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
      it('Should not set time span prop with wrong time span', () => {
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

      it('Should throw validation error', () => {
        expect(validationError).toEqual(undefined);
      });
      it('Should not set time span prop with wrong time span', () => {
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

      it('Should throw validation error', () => {
        expect(validationError).toEqual(undefined);
      });
      it('Should not set time span prop with wrong time span', () => {
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
    it('Should not set time span', () => {
      expect(holidayPlanner.timeSpan).toEqual(undefined);
    });
  });
});