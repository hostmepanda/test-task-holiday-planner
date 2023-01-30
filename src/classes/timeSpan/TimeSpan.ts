import { ErrorMessage } from './enums/errorMessage.enum';

export class TimeSpan {
  private timeSpanDay
  private timeSpanMonth
  private timeSpanYear
  private allowedYears = [2021, 2022];

  private validateDateString(dateString) {
    this.checkDateLength(dateString);

    return this;
  }

  private parseDate(date: string) {
    const [day, month, year] = date.split('.');

    if (!day || !month || !year) {
      throw new Error(ErrorMessage.ParseFailedWrongFormat);
    }

    this.checkDateDay(day)
      .checkDateMonth(month)
      .checkDateYear(year);

    this.timeSpanDay = Number(day);
    this.timeSpanMonth = Number(month);
    this.timeSpanYear = Number(year);
  }

  private checkDateLength(date) {
    if (date.length < 6 || date.length > 10) {
      throw new Error(ErrorMessage.ParseFailedWrongFormat);
    }

    return this;
  }

  private checkDatePart(datePart: string) {
    const isValidNUmber = !isNaN(Number(datePart));

    if (!isValidNUmber) {
      throw new Error(ErrorMessage.DateInvalid);
    }

    return this;
  }

  private checkDateMonth(dateString: string) {
    this
      .checkDatePart(dateString)
      .checkMonthBounds(Number(dateString));

    return this;
  }

  private checkDateDay(dateString: string) {
    this
      .checkDatePart(dateString)
      .checkDayBounds(Number(dateString));

    return this;
  }

  private checkDateYear(dateString: string) {
    this.checkDatePart(dateString)
      .checkYearBounds(Number(dateString));

    return this;
  }

  private checkDayBounds(day: number) {
    const isDayWithinValidBounds= day >= 1 && day <= 31;

    if (!isDayWithinValidBounds) {
      throw new Error(ErrorMessage.DateInvalidWrongDay);
    }
  }

  private checkMonthBounds(month: number) {
    const isMonthWithinValidBounds = month >= 1 && month <= 12;

    if (!isMonthWithinValidBounds) {
      throw new Error(ErrorMessage.DateInvalidWrongMonth);
    }

    return this;
  }

  private checkYearBounds(year: number) {
    const isYearWithinValidBounds = this.allowedYears.includes(year);

    if (!isYearWithinValidBounds) {
      throw new Error(ErrorMessage.DateInvalidYearOutBounds);
    }
    return this;
  }

  get timeSpan(): string {
    const dayString = this.timeSpanDay ? this.timeSpanDay + '.' : undefined;
    const monthString = this.timeSpanMonth ? this.timeSpanMonth + '.' : undefined;
    const yearString = this.timeSpanYear ?? '';

    const isAllPartsDefined = dayString && monthString && yearString;

    if (!isAllPartsDefined) {
      return undefined;
    }

    return `${dayString}${monthString}${yearString}`;
  }

  set timeSpan(dateString: string) {
    this.validateDateString(dateString)
      .parseDate(dateString);
  }
}
