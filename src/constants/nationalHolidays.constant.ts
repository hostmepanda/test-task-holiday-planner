export type NationalHolidays = {
  [key: string]: {
    [key: number]: string[],
  },
};

export const nationalHolidays: NationalHolidays = {
  FIN: {
    2021: [
      '1.1.2021',
      '6.1.2021',
      '2.4.2021',
      '5.4.2021',
      '13.5.2021',
      '25.6.2021',
      '6.12.2021',
      '24.12.2021',
    ],
    2022: [
      '1.1.2022',
      '6.1.2022',
      '15.4.2022',
      '18.4.2022',
      '1.5.2022',
      '26.5.2022',
      '5.6.2022',
      '24.6.2022',
      '25.6.2022',
      '6.12.2022',
      '24.12.2022',
      '25.12.2022',
      '26.12.2022',
    ],
  },
};
