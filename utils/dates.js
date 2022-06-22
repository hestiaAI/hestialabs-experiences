import * as d3 from 'd3'

export function isValidDate(d) {
  return d instanceof Date && !isNaN(d) && d.getFullYear() !== 1970
}

/**
 * Here we define the date and time formats used in the app
 */
export const dateFormatter = d3.timeFormat('%Y-%m-%d') // Specify Datetime and Date format to be sortable
export const datetimeFormatter = d3.timeFormat('%Y-%m-%d %H:%M:%S') // Specify Datetime and Date format to be sortable
export const dateParser = d3.timeParse('%Y-%m-%d') // Specify Datetime and Date format to be sortable
export const datetimeParser = d3.timeParse('%Y-%m-%d %H:%M:%S') // Specify Datetime and Date format to be sortable
export const timeFormatter = d3.timeFormat('%H:%M:%S')
export const timeParser = d3.timeParse('%H:%M:%S')
/**
 * Conversion from type-analyser.js format to d3 parser
 */
const regex = /(\w+) (\d{1,2})(?:st|nd|rd|th), (\d{4})/g
export const DATE_FORMAT_TO_D3 = {
  'YYYY-M-D': d3.timeParse('%Y-%m-%d'),
  'YYYY/M/D': d3.timeParse('%Y/%m/%d'),
  'M/D/YYYY': d3.timeParse('%m/%d/%Y'),
  'MMMM DD, YYYY': d3.timeParse('%B %d, %Y'),
  'MMM DD, YYYY': d3.timeParse('%b %d, %Y'),
  'MMMM Do, YYYY': d =>
    d3.timeParse('%B %d %Y')(regex.exec(d).splice(1).join(' ')),
  'MMM Do, YYYY': d =>
    d3.timeParse('%B %d %Y')(regex.exec(d).splice(1).join(' '))
}

export const TIME_FORMAT_TO_D3 = {
  X: d3.timeParse('%s'),
  x: d3.timeParse('%Q'),
  'H:m': d3.timeParse('%H:%M'),
  'HH:mmZ': d3.timeParse('%H:%M%Z'),
  'h:m a': d3.timeParse('%H:%M %p'),
  'H:m:s': d3.timeParse('%H:%M:%S'),
  'h:m:s a': d3.timeParse('%H:%M:%S %p'),
  'HH:mm:ssZZ': d3.timeParse('%H:%M:%S%Z'),
  'HH:mm:ss.SSSS': d3.timeParse('%H:%M:%S.%L'),
  'HH:mm:ss.SSSSZZ': d3.timeParse('%H:%M:%S.%L%Z')
}

/**
 * Convert the given value to a formated date string depending on it's name
 * If the name include date or time we assume that we can convert it with
 * javascript Date object, then if the year founded after conversion is 1970,
 * the starting date of unix timestamps, we assume that the timestamp is in
 * seconds instead of milliseconds finally we return the value inchanged if
 * we didnt succeed to convert it properly
 * @param {String} name the attribite name of the given value
 * @param {Any} value the value to convert
 * @returns the value transformed to local date string or the value inchanged if not possible
 */
export function toDateString(name, value) {
  const assumeDate = ['date', 'time'].find(d => name.toLowerCase().includes(d))
  if (assumeDate) {
    let date = new Date(value)
    if (isValidDate(date)) return date.toLocaleString()
    date = new Date(value * 1000)
    if (isValidDate(date)) return date.toLocaleString()
  }
  return value
}
