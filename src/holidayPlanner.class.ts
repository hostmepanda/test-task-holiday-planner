import { TimeSpan } from './classes/timeSpan/TimeSpan';
import { NationalHolidays, nationalHolidays } from './constants/nationalHolidays.constant';
import { CountryIso3166Alpha3 } from './enums/country.enum';

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export class HolidayPlanner {
  private _country
  private _timeSpanStartDate

  private _timeSpanEndDate

  private maxTimeSpanDaysPeriod = 50

  private holidayStartPeriodParams = { day: 1, month: 4 }

  private holidayEndPeriodParams = { day: 31, month: 3 }

  private nationalHolidays: NationalHolidays = nationalHolidays

  constructor() {
    this._timeSpanStartDate = new TimeSpan();
    this._timeSpanEndDate = new TimeSpan();
    this._country = CountryIso3166Alpha3.FIN;
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
    const startDate = this.getStartDateMs();
    const endDate = this.getEndDateMs();

    const diffMilliseconds = endDate - startDate;
    const diffDays = Math.floor(diffMilliseconds / ONE_DAY_MS);

    return diffDays >= this.maxTimeSpanDaysPeriod;
  }

  private isEndDateBeforeStartDate() {
    const startDateMs = this.getStartDateMs();
    const endDateMs = this.getEndDateMs();

    return endDateMs - startDateMs < 0;
  }

  private getStartDateMs() {
    const startDate = this._timeSpanStartDate.timeSpanObject;

    return (new Date(startDate.year, startDate.month - 1, startDate.day, 0, 0, 0)).valueOf();
  }

  private getEndDateMs() {
    const endDate = this._timeSpanEndDate.timeSpanObject;

    return (new Date(endDate.year, endDate.month - 1, endDate.day, 23, 59, 59)).valueOf();
  }

  private checkTimeSpanHolidayPeriod() {
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
      throw new Error(
        'Time span has to be within the same holiday period that begins on the 1st\n' +
        'of April and ends on the 31st of March.',
      );
    }
  }

  get country() {
    return this._country;
  }

  public getConsumedHolidayDays() {
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
        holidayMs => holidayMs >= startDateMs && holidayMs <= endDateMs,
      );

    const nonConsumableNationalHolidaysCount = nationalHolidaysMsList.length;
    const sundaysInTimeSpanCount = this.calculateWeekendDays(new Date(startDateMs), new Date(endDateMs));

    const consumedRegularHolidayDays = Math.round((endDateMs - startDateMs) / ONE_DAY_MS);

    const consumedDays = consumedRegularHolidayDays - sundaysInTimeSpanCount - nonConsumableNationalHolidaysCount;

    return {
      consumedDays,
      consumedRegularHolidayDays,
      nonConsumableNationalHolidaysCount,
      sundaysInTimeSpanCount,
    };
  }

  private calculateWeekendDays(fromDate, toDate){
    let weekendDayCount = 0;

    while(fromDate < toDate){
      fromDate.setDate(fromDate.getDate() + 1);
      if(fromDate.getDay() === 0){
        ++weekendDayCount ;
      }
    }
    return weekendDayCount ;
  }


  private convertTextDateToMilliseconds(textDate) {
    const [day, month, year] = textDate.split('.');

    return (
      new Date(Number(year), Number(month) - 1, Number(day))
    ).valueOf();
  }
}
