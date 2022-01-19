/**
 * Convert the given value to a formated date string depending on it's name
 * @param {String} name the attribite name of the given value
 * @param {Any} value the value to convert
 * @returns the value transformed to local date string or the value inchanged if not possible
 */
export function toDateString(name, value) {
  const assumeDate = ['date', 'time'].find(d => name.toLowerCase().includes(d))
  if (assumeDate) {
    return new Date(value).getFullYear() > 1980
      ? new Date(value).toLocaleString()
      : new Date(value * 1000).toLocaleString()
  } else {
    return value
  }
}
