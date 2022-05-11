import * as d3 from 'd3'

export function isValidDate(d) {
  return d instanceof Date && !isNaN(d) && d.getFullYear() !== 1970
}

/**
 * Here we define the date and time formats used in the app
 */
export const dateFormatter = d3.timeFormat('%Y-%m-%d') // Specify Datetime and Date format to be sortable
export const datetimeFormatter = d3.timeFormat('%Y-%m-%d, %H:%M:%S') // Specify Datetime and Date format to be sortable
export const dateParser = d3.timeParse('%Y-%m-%d') // Specify Datetime and Date format to be sortable
export const datetimeParser = d3.timeParse('%Y-%m-%d, %H:%M:%S') // Specify Datetime and Date format to be sortable

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
