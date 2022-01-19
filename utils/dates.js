export function isValidDate(d) {
  return d instanceof Date && !isNaN(d) && d.getFullYear() !== 1970
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
