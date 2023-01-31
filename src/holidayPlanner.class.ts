import { TimeSpan } from './classes/timeSpan/TimeSpan';

import { nationalHolidays, NationalHolidays, ONE_DAY_MS } from './constants';
import { HolidayPeriodParams } from './types';
import { CountryIso3166Alpha3, ErrorMessage } from './enums';

export class HolidayPlanner {
  protected readonly _country: CountryIso3166Alpha3
  protected _timeSpanStartDate: TimeSpan

  protected _timeSpanEndDate: TimeSpan

  protected maxTimeSpanDaysPeriod: number = 50

  protected holidayStartPeriodParams: HolidayPeriodParams = { day: 1, month: 4 }

  protected holidayEndPeriodParams: HolidayPeriodParams = { day: 31, month: 3 }

  protected nationalHolidays: NationalHolidays = nationalHolidays

  constructor() {
    this._timeSpanStartDate = new TimeSpan();
    this._timeSpanEndDate = new TimeSpan();
    this._country = CountryIso3166Alpha3.FIN;
  }

  protected checkTimeSpanHolidayPeriod(): void | Error {
    const startDateMs = this.getStartDateMs();
    const endDateMs = this.getEndDateMs();

    const holidayStartDateMs = this.getHolidayPeriodStartDateMs();
    const holidayEndDateMs = this.getHolidayPeriodEndDateMs();

    const isHolidayStartDateWithinTimeSpan = holidayStartDateMs > startDateMs && holidayStartDateMs < endDateMs;
    const isHolidayEndDateWithinTimeSpan = holidayEndDateMs > startDateMs && holidayEndDateMs < endDateMs;

    if (isHolidayStartDateWithinTimeSpan || isHolidayEndDateWithinTimeSpan) {
      throw new Error(ErrorMessage.TimeSpanOutsideHolidayPeriod);
    }
  }

  protected convertTextDateToMilliseconds(textDate): number {
    const [day, month, year] = textDate.split('.');

    return (
      new Date(Number(year), Number(month) - 1, Number(day))
    ).valueOf();
  }

  protected countTimeSpanSundays(): number {
    const startDateMs = this.getStartDateMs();
    const endDateMs = this.getEndDateMs();

    const periodStartDate = new Date(startDateMs);
    const periodEndDate = new Date(endDateMs);

    const SUNDAY: number = 0;
    const ONE_DAY: number = 1;

    let sundaysCount:number = 0;

    while(periodStartDate < periodEndDate){
      const nextDate = periodStartDate.getDate() + ONE_DAY;

      periodStartDate.setDate(nextDate);
      const isSunday = periodStartDate.getDay() === SUNDAY;

      if(isSunday){
        sundaysCount += 1;
      }
    }

    return sundaysCount;
  }

  protected countHolidayDaysInPeriod(): number {
    const startDateMs = this.getStartDateMs();
    const endDateMs = this.getEndDateMs();

    const { year: startDateYear } = this._timeSpanStartDate.timeSpanObject;
    const { year: endDateYear } = this._timeSpanEndDate.timeSpanObject;

    const timeSpanYears = [
      ...Array.from(
        new Set([startDateYear, endDateYear]),
      ),
    ];

    const listOfHolidays: [string, string[]][] = Object.entries(this.nationalHolidays[this._country]);

    const filteredNationalHolidays: number[] = listOfHolidays
      .filter(([year]) => timeSpanYears.includes(Number(year)))
      .flatMap(([_, holidays]) => holidays)
      .map(this.convertTextDateToMilliseconds)
      .filter(holidayMs => this.filterHolidaysExcludingSundays(holidayMs, startDateMs, endDateMs));

    return filteredNationalHolidays.length;
  }

  protected countTimeSpanDays(): number {
    const startDateMs = this.getStartDateMs();
    const endDateMs = this.getEndDateMs();

    return Math.round((endDateMs - startDateMs) / ONE_DAY_MS);
  }

  get country(): CountryIso3166Alpha3 {
    return this._country;
  }

  protected filterHolidaysExcludingSundays(holidayMs: number, startDateMs: number, endDateMs: number): boolean {
    const SUNDAY = 0;

    const isHolidayOnSunday = new Date(holidayMs).getDay() === SUNDAY;

    if (isHolidayOnSunday) {
      return false;
    }
    return holidayMs >= startDateMs && holidayMs <= endDateMs
  }

  protected getHolidayPeriodStartDateMs(): number {
    this.throwIfTimeSpanStartIsNotSet();

    const startDate = this._timeSpanStartDate.timeSpanObject;

    return (
      new Date(
        startDate.year,
        this.holidayStartPeriodParams.month - 1,
        this.holidayStartPeriodParams.day,
      )
    ).valueOf();
  }

  protected getHolidayPeriodEndDateMs(): number {
    this.throwIfTimeSpanEndIsNotSet();

    const endDate = this._timeSpanEndDate.timeSpanObject;

    return (
      new Date(
        endDate.year,
        this.holidayEndPeriodParams.month - 1,
        this.holidayEndPeriodParams.day,
      )
    ).valueOf();
  }

  protected checkTimeSpanEndDateBeforeStartDate(): void | Error {
    const startDateMs = this.getStartDateMs();
    const endDateMs = this.getEndDateMs();

    const isEndDateBeforeStartDate = endDateMs - startDateMs < 0;

    if (isEndDateBeforeStartDate) {
      throw new Error(ErrorMessage.StartDateMustBeforeEndDate);
    }
  }

  protected checkTimeSpanExceeds50Days(): void | Error {
    const startDate = this.getStartDateMs();
    const endDate = this.getEndDateMs();

    const diffMilliseconds = endDate - startDate;
    const diffDays = Math.floor(diffMilliseconds / ONE_DAY_MS);

    const isExceed50Days = diffDays >= this.maxTimeSpanDaysPeriod;

    if (isExceed50Days) {
      throw new Error(ErrorMessage.MaximumLength50Days);
    }
  }

  public getConsumedHolidayDays(): number {
    const nonConsumableNationalHolidaysCount = this.countHolidayDaysInPeriod();
    const sundaysInTimeSpanCount = this.countTimeSpanSundays();
    const consumedRegularHolidayDays = this.countTimeSpanDays();

    return consumedRegularHolidayDays - sundaysInTimeSpanCount - nonConsumableNationalHolidaysCount;
  }

  protected getEndDateMs(): number {
    this.throwIfTimeSpanEndIsNotSet();

    const endDate = this._timeSpanEndDate.timeSpanObject;

    return (
      new Date(
        endDate.year,
        endDate.month - 1,
        endDate.day,
        23,
        59,
        59,
      )
    ).valueOf();
  }

  protected getStartDateMs(): number {
    this.throwIfTimeSpanStartIsNotSet();

    const startDate = this._timeSpanStartDate.timeSpanObject;

    return (
      new Date(
        startDate.year,
        startDate.month - 1,
        startDate.day,
        0,
        0,
        0,
      )
    ).valueOf();
  }

  get timeSpan(): string | undefined {
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
      this.checkTimeSpanEndDateBeforeStartDate();
      this.checkTimeSpanExceeds50Days();
      this.checkTimeSpanHolidayPeriod();
    } catch (error: unknown) {
      this._timeSpanStartDate.timeSpan = null;
      this._timeSpanEndDate.timeSpan = null;

      throw error;
    }
  }

  protected throwIfTimeSpanEndIsNotSet(): void | Error {
    const isTimeSpanEndDateSet = this._timeSpanEndDate.timeSpan;

    if (!isTimeSpanEndDateSet) {
      throw new Error(ErrorMessage.TimeSpanMustBeSet);
    }
  }

  protected throwIfTimeSpanStartIsNotSet(): void | Error {
    const isTimeSpanStartDateSet = this._timeSpanStartDate.timeSpan;

    if (!isTimeSpanStartDateSet) {
      throw new Error(ErrorMessage.TimeSpanMustBeSet);
    }
  }
}
