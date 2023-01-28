type TimeSpan = string;

export class HolidayPlanner<T = TimeSpan> {
  private timeSpan: T

  constructor(timeSpan: T) {
    this.timeSpan = timeSpan;
  }
}
