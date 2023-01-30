export enum ErrorMessage {
  ParseFailedWrongFormat = 'Failed to parse date string: date should be in format d.m.yyyy',
  DateInvalid = `Date is invalid, some of its part is not a valid number. Date should be in format d.m.yyyy`,
  DateInvalidWrongDay= 'Day of the provided span date is invalid. Month should be a value between 1 and 30(31), considering a leap year',
  DateInvalidWrongMonth = 'Month of the provided span date is invalid. Month should be a value between 1 and 12',
  DateInvalidYearOutBounds = 'Year of the provided span date is out of bounds. Yar should be 2021 or 2022',
}
