import * as d3 from 'd3'
/**
 * Fill in the missing dates of an array of dated objects with a specific value.
 * @param  {Array} data  array of objects that include dates
 * @param  {String} dateAccessor  the key of date object
 * @param  {String} valueAccessor the key of the value to add for each missing date
 * @param  {String} interval  the d3 interval between each date, e.g: d3.timeDay, d3.timeMonth
 * @param  {Any} fillValue  the value to fill for each missing date, default to 0.
 * @param  {Date} minDate  the starting date range, computed from the data by default.
 * @param  {Date} maxDate  the ending date range, computed from the data by default.
 * @return {Array} the modified data array with the missing dates and their value added
 */
export function addMissingDate(
  data,
  dateAccessor,
  valueAccessor,
  interval,
  fillValue = 0,
  minDate = null,
  maxDate = null
) {
  if (data.length <= 0) return []
  // Compute the min and max date
  const extent = d3.extent(data, d => new Date(d[dateAccessor]))

  // Get the list of dates between this extent
  const dates = interval.range(
    minDate !== null ? minDate : extent[0],
    maxDate !== null ? maxDate : extent[1],
    1
  )

  // Get dates that are not in the above list
  const missingDates = dates.filter(
    value => !data.map(d => d[dateAccessor]).includes(value.toString())
  )

  missingDates.forEach(date => {
    const obj = { ...data[0] }
    obj[dateAccessor] = date
    obj[valueAccessor] = fillValue
    data.push(obj)
  })

  return data
}
