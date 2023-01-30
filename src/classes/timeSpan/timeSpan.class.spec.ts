import { TimeSpanClass } from './TimeSpan.class';
import { ErrorMessage } from './enums/errorMessage.enum';

describe('TimeSpanClass class', function () {
  let testTimeSpan;

  describe('Without setting time span', () => {
    beforeAll(() => {
      testTimeSpan = new TimeSpanClass();
    });

    afterAll(() => {
      testTimeSpan = null;
    });

    it('Instance should have undefined timeSpan', () => {
      expect(testTimeSpan).toHaveProperty('timeSpan');
      expect(testTimeSpan.timeSpan).toBe(undefined);
    });
  });

  describe('With correct time span input', () => {
    let thrownError: Partial<Error>;
    const correctTimeSpan = '21.7.2022';

    beforeAll(() => {
      testTimeSpan = new TimeSpanClass();
    });

    beforeAll(() => {
      try {
        testTimeSpan.timeSpan = correctTimeSpan;
      } catch (error: unknown) {
        thrownError = error;
      }
    });

    afterAll(() => {
      testTimeSpan = null;
    });

    it('Should not throw errors', () => {
      expect(thrownError).toBe(undefined);
    });
    it('Should set time span with provided value', () => {
      expect(testTimeSpan.timeSpan).toEqual(correctTimeSpan);
    });
  });

  describe('With invalid time span input', () => {
    let thrownError: Partial<Error>;
    describe('With invalid day', () => {
      const timeSpanInvalidDay = '32.17.2022';

      beforeAll(() => {
        testTimeSpan = new TimeSpanClass();
      });

      beforeAll(() => {
        try {
          testTimeSpan.timeSpan = timeSpanInvalidDay;
        } catch (error: unknown) {
          thrownError = error;
        }
      });

      afterAll(() => {
        thrownError = undefined;
        testTimeSpan = null;
      });

      it('Should throw errors', () => {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toEqual(ErrorMessage.DateInvalidWrongDay);
      });
      it('Should not set time span with provided value', () => {
        expect(testTimeSpan.timeSpan).toEqual(undefined);
      });
    });
    describe('With invalid month', () => {
      const timeSpanInvalidMonth = '21.17.2022';

      beforeAll(() => {
        testTimeSpan = new TimeSpanClass();
      });

      beforeAll(() => {
        try {
          testTimeSpan.timeSpan = timeSpanInvalidMonth;
        } catch (error: unknown) {
          thrownError = error;
        }
      });

      afterAll(() => {
        thrownError = undefined;
        testTimeSpan = null;
      });

      it('Should throw errors', () => {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toEqual(ErrorMessage.DateInvalidWrongMonth);
      });
      it('Should not set time span with provided value', () => {
        expect(testTimeSpan.timeSpan).toEqual(undefined);
      });
    });
    describe('With year not in bounds', () => {
      const timeSpanOutBoundsYear = '21.4.2023';

      beforeAll(() => {
        testTimeSpan = new TimeSpanClass();
      });

      beforeAll(() => {
        try {
          testTimeSpan.timeSpan = timeSpanOutBoundsYear;
        } catch (error: unknown) {
          thrownError = error;
        }
      });

      afterAll(() => {
        thrownError = undefined;
        testTimeSpan = null;
      });

      it('Should throw errors', () => {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toEqual(ErrorMessage.DateInvalidYearOutBounds);
      });
      it('Should not set time span with provided value', () => {
        expect(testTimeSpan.timeSpan).toEqual(undefined);
      });
    });
    describe('With time span string less allowed length', () => {
      const timeSpanInvalidLength = '21.42023';

      beforeAll(() => {
        testTimeSpan = new TimeSpanClass();
      });

      beforeAll(() => {
        try {
          testTimeSpan.timeSpan = timeSpanInvalidLength;
        } catch (error: unknown) {
          thrownError = error;
        }
      });

      afterAll(() => {
        thrownError = undefined;
        testTimeSpan = null;
      });

      it('Should throw errors', () => {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toEqual(ErrorMessage.ParseFailedWrongFormat);
      });
      it('Should not set time span with provided value', () => {
        expect(testTimeSpan.timeSpan).toEqual(undefined);
      });
    });
    describe('With time span string greater allowed length', () => {
      const timeSpanInvalidLength = '0123456789';

      beforeAll(() => {
        testTimeSpan = new TimeSpanClass();
      });

      beforeAll(() => {
        try {
          testTimeSpan.timeSpan = timeSpanInvalidLength;
        } catch (error: unknown) {
          thrownError = error;
        }
      });

      afterAll(() => {
        thrownError = undefined;
        testTimeSpan = null;
      });

      it('Should throw errors', () => {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toEqual(ErrorMessage.ParseFailedWrongFormat);
      });
      it('Should not set time span with provided value', () => {
        expect(testTimeSpan.timeSpan).toEqual(undefined);
      });
    });
    describe('With time span containing non-digits in day', () => {
      const timeSpanInvalidDay = 'AB.4.2023';

      beforeAll(() => {
        testTimeSpan = new TimeSpanClass();
      });

      beforeAll(() => {
        try {
          testTimeSpan.timeSpan = timeSpanInvalidDay;
        } catch (error: unknown) {
          thrownError = error;
        }
      });

      afterAll(() => {
        thrownError = undefined;
        testTimeSpan = null;
      });

      it('Should throw errors', () => {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toEqual(ErrorMessage.DateInvalid);
      });
      it('Should not set time span with provided value', () => {
        expect(testTimeSpan.timeSpan).toEqual(undefined);
      });
    });
    describe('With time span containing non-digits in month', () => {
      const timeSpanInvalidMonth = '14.D.2023';

      beforeAll(() => {
        testTimeSpan = new TimeSpanClass();
      });

      beforeAll(() => {
        try {
          testTimeSpan.timeSpan = timeSpanInvalidMonth;
        } catch (error: unknown) {
          thrownError = error;
        }
      });

      afterAll(() => {
        thrownError = undefined;
        testTimeSpan = null;
      });

      it('Should throw errors', () => {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toEqual(ErrorMessage.DateInvalid);
      });
      it('Should not set time span with provided value', () => {
        expect(testTimeSpan.timeSpan).toEqual(undefined);
      });
    });
    describe('With time span containing non-digits in year', () => {
      const timeSpanInvalidYear = '14.4.20AA';

      beforeAll(() => {
        testTimeSpan = new TimeSpanClass();
      });

      beforeAll(() => {
        try {
          testTimeSpan.timeSpan = timeSpanInvalidYear;
        } catch (error: unknown) {
          thrownError = error;
        }
      });

      afterAll(() => {
        thrownError = undefined;
        testTimeSpan = null;
      });

      it('Should throw errors', () => {
        expect(thrownError).toBeInstanceOf(Error);
        expect(thrownError.message).toEqual(ErrorMessage.DateInvalid);
      });
      it('Should not set time span with provided value', () => {
        expect(testTimeSpan.timeSpan).toEqual(undefined);
      });
    });
  });
});