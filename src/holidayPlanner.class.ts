import { TimeSpan } from './classes/timeSpan/TimeSpan';

export class HolidayPlanner {
  private _timeSpanStartDate

  private _timeSpanEndDate

  private maxTimeSpanDaysPeriod = 50

  private holidayStartPeriodParams = { day: 1, month: 4 }

  private holidayEndPeriodParams = { day: 31, month: 3 }

  constructor() {
    this._timeSpanStartDate = new TimeSpan();
    this._timeSpanEndDate = new TimeSpan();
  }

  get timeSpan() {
    const startDate = this._timeSpanStartDate.timeSpan;
    const endDate = this._timeSpanEndDate.timeSpan;

    if (!startDate || !endDate) {
      return undefined;
    }

    return `${startDate} - ${endDate}`;
  }

  set timeSpan(timeSpan: string | string[]) {
    let startDate;
    let endDate;

    if (Array.isArray(timeSpan)) {
      ([startDate, endDate] = timeSpan);

    } else {
      const timeSpanParts = timeSpan.split('-');
      ([startDate, endDate] = timeSpanParts.map(timeSpanPart => timeSpanPart.trim()));
    }

    this._timeSpanStartDate.timeSpan = startDate;
    this._timeSpanEndDate.timeSpan = endDate;

    try {
      if (this.isEndDateBeforeStartDate()) {
        throw new Error('TIme span start date should be before the end date');
      }

      if (this.isTimeSpanExceeds50Days()) {
        throw new Error('The maximum length of the time span is 50 days');
      }

      this.checkTimeSpanHolidayPeriod();
    } catch (error: unknown) {
      this._timeSpanStartDate.timeSpan = null;
      this._timeSpanEndDate.timeSpan = null;

      throw error;
    }
  }

  private isTimeSpanExceeds50Days() {
    const startDate = this._timeSpanStartDate.timeSpanObject;
    const endDate = this._timeSpanEndDate.timeSpanObject;

    const startDateMs: Date = new Date(startDate.year, startDate.month - 1, startDate.day);
    const endDateMs: Date = new Date(endDate.year, endDate.month - 1, endDate.day);

    const diffMilliseconds = endDateMs.valueOf() - startDateMs.valueOf();
    const diffDays = Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));

    return diffDays >= this.maxTimeSpanDaysPeriod;
  }

  private isEndDateBeforeStartDate() {
    const startDate = this._timeSpanStartDate.timeSpanObject;
    const endDate = this._timeSpanEndDate.timeSpanObject;

    const startDateMs = (
      new Date(startDate.year, startDate.month - 1, startDate.day)
    ).valueOf();

    const endDateMs = (
      new Date(endDate.year, endDate.month - 1, endDate.day)
    ).valueOf();

    return endDateMs - startDateMs < 0;
  }

  private checkTimeSpanHolidayPeriod() {
    const startDate = this._timeSpanStartDate.timeSpanObject;
    const endDate = this._timeSpanEndDate.timeSpanObject;

    const startDateMs = (new Date(startDate.year, startDate.month - 1, startDate.day)).valueOf();
    const endDateMs = (new Date(endDate.year, endDate.month - 1, endDate.day)).valueOf();

    const holidayStartDateMs = (
      new Date(
        startDate.year,
        this.holidayStartPeriodParams.month - 1,
        this.holidayStartPeriodParams.day,
        )
    ).valueOf();

    const holidayEndDateMs = (
      new Date(
        endDate.year,
        this.holidayEndPeriodParams.month - 1,
        this.holidayEndPeriodParams.day,
        )
    ).valueOf();

    const isHolidayStartDateWithinTimeSpan = holidayStartDateMs > startDateMs && holidayStartDateMs < endDateMs;
    const isHolidayEndDateWithinTimeSpan = holidayEndDateMs > startDateMs && holidayEndDateMs < endDateMs;

    if (isHolidayStartDateWithinTimeSpan || isHolidayEndDateWithinTimeSpan) {
      throw new Error(
        'Time span has to be within the same holiday period that begins on the 1st\n' +
        'of April and ends on the 31st of March.',
      );
    }
  }
}
