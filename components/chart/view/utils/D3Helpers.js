import * as d3 from 'd3'
/**
 * Fill in the missing dates of an array of dated objects with a specific value.
 * @param  {Array} data  array of objects that include dates
 * @param  {String} dateAccessor  the key of date object
 * @param  {String} valueAccessor the key of the value to add for each missing date
 * @param  {String} interval  the d3 interval between each date, e.g: d3.timeDay, d3.timeMonth
 * @param  {Any} fillValue  the value to fill for each missing date, default to 0.
 * @return {Array} the modified data array with the missing dates and their value added
 */
export function addMissingDate(
  data,
  dateAccessor,
  valueAccessor,
  interval,
  fillValue = 0
) {
  // Compute the min and max date
  const extent = d3.extent(this.data, d => new Date(d[dateAccessor]))

  // Get the list of dates between this extent
  const dates = interval.range(extent[0], extent[1], 1)

  // Get dates that are not in the above list
  const missingDates = dates.filter(
    value => !data.map(d => d[dateAccessor]).includes(value)
  )

  missingDates.forEach(date => {
    data.push({ dateAccessor: date, valueAccessor: fillValue })
  })

  return data
}
