# Programming task

## Understanding the problem
The HolidayPlanner class should return number of holidays to be spent by a person withing the given time span.

## Compromises
- Since it's a first version of a tool, an assumption against date format is made: in this version we support 
European date format as DD.MM.YYYY
- Year should be passed as full year e.g. 20XX, if short 2 digit year is passed then a validation error is thrown
- Requirement to delimiter are not mentioned, so dot is used a default delimiter in this version
- Date format, remove leading zeros in day and month

## Statement
Design and implement a HolidayPlanner class. The purpose of the
first version of the class is to:
- Take a time span as an input (for example 1.7.2021 - 29.7.2021) and return how
many holiday days a person has to use to be able to be on holiday during that period
- Take into account national holidays which do not consume holiday days
- Take into account that Saturdays consume holiday days
- Take into account that Sundays do no consume holiday days
- Accept only time spans that fit within the current holiday period

Company has specified these additional requirements for the time span:
- The maximum length of the time span is 50 days
- The whole time span has to be within the same holiday period that begins on the 1st
of April and ends on the 31st of March. For example:
  - 1.12.2021 - 2.1.2022 is a valid time span for a holiday
  - 1.3.2021 - 1.4.2021 is not a valid time span for a holiday
- The dates for the time span must be in chronological order
- The implementation needs to take into account that national holidays change from year to
year and in the future the usage of the class will be extended to other countries, so it must
support national holidays for several countries. The first version needs to be able to handle
Finnish national holidays for 2021 and 2022:
  - 1.1.2021
  - 6.1.2021
  - 2.4.2021
  - 5.4.2021
  - 13.5.2021
  - 25.6.2021
  - 6.12.2021
  - 24.12.2021

  - 1.1.2022
  - 6.1.2022
  - 15.4.2022
  - 18.4.2022
  - 1.5.2022
  - 26.5.2022
  - 5.6.2022
  - 24.6.2022
  - 25.6.2022
  - 6.12.2022
  - 24.12.2022
  - 25.12.2022
  - 26.12.2022

Company’s quality requirements are:
- The code must be unit testable
- The code should adhere to SOLID principles

Write a short description of:
- how you understood the problem,
- what challenges you had with the implementation
- and what you could further improve in your implementation.
- If you had to make compromises, we would like to hear about them.