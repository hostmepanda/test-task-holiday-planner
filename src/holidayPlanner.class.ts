import { TimeSpan } from './classes/timeSpan/TimeSpan';

import { nationalHolidays, NationalHolidays, ONE_DAY_MS } from './constants';
import { HolidayPeriodParams } from './types';
import { CountryIso3166Alpha3, ErrorMessage } from './enums';

export class HolidayPlanner {
  private readonly _country: CountryIso3166Alpha3
  private _timeSpanStartDate: TimeSpan

  private _timeSpanEndDate: TimeSpan

  private maxTimeSpanDaysPeriod: number = 50

  private holidayStartPeriodParams: HolidayPeriodParams = { day: 1, month: 4 }

  private holidayEndPeriodParams: HolidayPeriodParams = { day: 31, month: 3 }

  private nationalHolidays: NationalHolidays = nationalHolidays

  constructor() {
    this._timeSpanStartDate = new TimeSpan();
    this._timeSpanEndDate = new TimeSpan();
    this._country = CountryIso3166Alpha3.FIN;
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
      if (this.isEndDateBeforeStartDate()) {
        throw new Error(ErrorMessage.StartDateMustBeforeEndDate);
      }

      if (this.isTimeSpanExceeds50Days()) {
        throw new Error(ErrorMessage.MaximumLength50Days);
      }

      this.checkTimeSpanHolidayPeriod();
    } catch (error: unknown) {
      this._timeSpanStartDate.timeSpan = null;
      this._timeSpanEndDate.timeSpan = null;

      throw error;
    }
  }

  private isTimeSpanExceeds50Days(): boolean {
    const startDate = this.getStartDateMs();
    const endDate = this.getEndDateMs();

    const diffMilliseconds = endDate - startDate;
    const diffDays = Math.floor(diffMilliseconds / ONE_DAY_MS);

    return diffDays >= this.maxTimeSpanDaysPeriod;
  }

  private isEndDateBeforeStartDate(): boolean {
    const startDateMs = this.getStartDateMs();
    const endDateMs = this.getEndDateMs();

    return endDateMs - startDateMs < 0;
  }

  private getStartDateMs(): number {
    const startDate = this._timeSpanStartDate.timeSpanObject;

    return (new Date(startDate.year, startDate.month - 1, startDate.day, 0, 0, 0)).valueOf();
  }

  private getEndDateMs(): number {
    const endDate = this._timeSpanEndDate.timeSpanObject;

    return (new Date(endDate.year, endDate.month - 1, endDate.day, 23, 59, 59)).valueOf();
  }

  private checkTimeSpanHolidayPeriod(): void | Error {
    const startDate = this._timeSpanStartDate.timeSpanObject;
    const endDate = this._timeSpanEndDate.timeSpanObject;

    const startDateMs = this.getStartDateMs();
    const endDateMs = this.getEndDateMs();

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
      throw new Error(ErrorMessage.TimeSpanOutsideHolidayPeriod);
    }
  }

  get country(): CountryIso3166Alpha3 {
    return this._country;
  }

  public getConsumedHolidayDays(): number {
    const { year: startDateYear } = this._timeSpanStartDate.timeSpanObject;
    const { year: endDateYear } = this._timeSpanEndDate.timeSpanObject;

    const startDateMs = this.getStartDateMs();
    const endDateMs = this.getEndDateMs();

    const timeSpanYears = [
      ...Array.from(
        new Set([startDateYear, endDateYear]),
      ),
    ];

    const nationalHolidaysMsList = Object.entries(this.nationalHolidays[this._country])
      .filter(([year]) => timeSpanYears.includes(Number(year)))
      .flatMap(([_, holidays]) => holidays)
      .map(this.convertTextDateToMilliseconds)
      .filter(
        holidayMs => {
          const isHolidayOnSunday = new Date(holidayMs).getDay() === 0;
          if (isHolidayOnSunday) {
            return false;
          }
          return holidayMs >= startDateMs && holidayMs <= endDateMs
        },
      );

    const nonConsumableNationalHolidaysCount = nationalHolidaysMsList.length;
    const sundaysInTimeSpanCount = this.calculateWeekendDays(new Date(startDateMs), new Date(endDateMs));

    const consumedRegularHolidayDays = Math.round((endDateMs - startDateMs) / ONE_DAY_MS);

    return consumedRegularHolidayDays - sundaysInTimeSpanCount - nonConsumableNationalHolidaysCount;
  }

  private calculateWeekendDays(fromDate, toDate): number {
    let weekendDayCount = 0;

    while(fromDate < toDate){
      fromDate.setDate(fromDate.getDate() + 1);
      if(fromDate.getDay() === 0){
        ++weekendDayCount ;
      }
    }
    return weekendDayCount ;
  }


  private convertTextDateToMilliseconds(textDate): number {
    const [day, month, year] = textDate.split('.');

    return (
      new Date(Number(year), Number(month) - 1, Number(day))
    ).valueOf();
  }
}
