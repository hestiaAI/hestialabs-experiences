import { timeFormatLocale, TimeLocaleObject, timeFormat } from 'd3-time-format'

export function error(message: string): void {
  throw new Error(message)
}

export const enforceArray = (value: string | string[]): string[] =>
  typeof value === 'string' ? [value] : value

export const dateFormatter: (date: Date) => string =
  timeFormat('%Y-%m-%d %H:%M:%S')

/**
 * Object that list the supported locales and their configuration.
 * Configuration taken from https://github.com/d3/d3-time-format/tree/main/locale
 */
export enum SUPPORTED_LOCALE {
  EN = 'en-GB',
  FR = 'fr-FR'
}

/**
 * Configuration associated with each locale
 */
const LOCALES: { [key in SUPPORTED_LOCALE]: TimeLocaleObject } = {
  [SUPPORTED_LOCALE.FR]: timeFormatLocale({
    dateTime: '%A %e %B %Y à %X',
    date: '%d/%m/%Y',
    time: '%H:%M:%S',
    periods: ['AM', 'PM'],
    days: [
      'dimanche',
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi'
    ],
    shortDays: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
    months: [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre'
    ],
    shortMonths: [
      'janv.',
      'févr.',
      'mars',
      'avr.',
      'mai',
      'juin',
      'juil.',
      'août',
      'sept.',
      'oct.',
      'nov.',
      'déc.'
    ]
  }),
  [SUPPORTED_LOCALE.EN]: timeFormatLocale({
    dateTime: '%a %e %b %X %Y',
    date: '%d/%m/%Y',
    time: '%H:%M:%S',
    periods: ['AM', 'PM'],
    days: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
  })
}

/**
 * Memorise the use of different parsers to limit instantiation for each data point
 */
const localeParsers: {
  [index: string]: { [index: string]: (dateString: string) => Date | null }
} = {
  'fr-FR': {},
  'en-GB': {}
}

/**
 * Convert a string into a date object given a locale name and a date format
 * @param {String} dateString the attribite name of the given value
 * @param {String} dateFormat the value to convert
 * @param {String} dateLocale the value to convert
 * @returns the value transformed to a date object or null if the date is invalid.
 */

export function toDateObject(
  dateString: string,
  dateFormat: string,
  dateLocale: SUPPORTED_LOCALE
): Date | null {
  const parser = getParser(dateFormat, dateLocale)
  return parser(dateString)
}

/**
 * Convert a string into a date string usable by Date constructor, given a locale name and a date format
 * @param {String} dateString the attribite name of the given value
 * @param {String} dateFormat the value to convert
 * @param {String} dateLocale the value to convert
 * @returns the value transformed to a date string or null if the date is invalid.
 */
export function toDateString(
  dateString: string,
  dateFormat: string,
  dateLocale: SUPPORTED_LOCALE
): string {
  const date = toDateObject(dateString, dateFormat, dateLocale)
  return date ? dateFormatter(date) : ''
}

/**
 * Get a date parser function that depend on a format and a locale
 * @param {String} dateFormat the value to convert
 * @param {String} dateLocale the value to convert
 * @returns a date parser function that transform strings to date objects
 */
export function getParser(
  dateFormat: string,
  dateLocale: SUPPORTED_LOCALE
): (dateString: string) => Date | null {
  if (!Object.keys(LOCALES).includes(dateLocale)) {
    throw new Error(
      'Invalid Locale: ' +
        dateLocale +
        '. Choose one of ' +
        Object.keys(LOCALES).join(',')
    )
  }
  if (!(dateFormat in localeParsers[dateLocale])) {
    const locale = LOCALES[dateLocale]
    localeParsers[dateLocale][dateFormat] = locale.parse(dateFormat)
  }
  return localeParsers[dateLocale][dateFormat]
}
