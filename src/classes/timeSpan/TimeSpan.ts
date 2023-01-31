import { ErrorMessage } from './enums/errorMessage.enum';

export class TimeSpan {
  protected timeSpanDay

  protected timeSpanMonth

  protected timeSpanYear

  protected allowedYears = [2021, 2022];

  protected validateDateString(dateString) {
    this.checkDateLength(dateString);

    return this;
  }

  protected parseDate(date: string) {
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

  protected checkDateLength(date) {
    if (date.length < 6 || date.length > 10) {
      throw new Error(ErrorMessage.ParseFailedWrongFormat);
    }

    return this;
  }

  protected checkDatePart(datePart: string) {
    const isValidNUmber = !isNaN(Number(datePart));

    if (!isValidNUmber) {
      throw new Error(ErrorMessage.DateInvalid);
    }

    return this;
  }

  protected checkDateMonth(dateString: string) {
    this
      .checkDatePart(dateString)
      .checkMonthBounds(Number(dateString));

    return this;
  }

  protected checkDateDay(dateString: string) {
    this
      .checkDatePart(dateString)
      .checkDayBounds(Number(dateString));

    return this;
  }

  protected checkDateYear(dateString: string) {
    this.checkDatePart(dateString)
      .checkYearBounds(Number(dateString));

    return this;
  }

  protected checkDayBounds(day: number) {
    const isDayWithinValidBounds= day >= 1 && day <= 31;

    if (!isDayWithinValidBounds) {
      throw new Error(ErrorMessage.DateInvalidWrongDay);
    }
  }

  protected checkMonthBounds(month: number) {
    const isMonthWithinValidBounds = month >= 1 && month <= 12;

    if (!isMonthWithinValidBounds) {
      throw new Error(ErrorMessage.DateInvalidWrongMonth);
    }

    return this;
  }

  protected checkYearBounds(year: number) {
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
    if (dateString === null) {
      this.timeSpanDay = undefined;
      this.timeSpanMonth = undefined;
      this.timeSpanYear = undefined;

      return;
    }

    this.validateDateString(dateString)
      .parseDate(dateString);
  }

  get timeSpanObject() {
    return {
      day: this.timeSpanDay,
      month: this.timeSpanMonth,
      year: this.timeSpanYear,
      value: this.timeSpan,
    }
  }
}
