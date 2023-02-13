/**
 * Function to calculate the best viewport (centre and zoom level) given a data table with rows of data.
 * Each row of data may contain one or more datapoints. Each datapoint in the row is extractable by a pair of column names.
 * output is in the format that is required by KeplerGL's updateMap. See
 * https://docs.kepler.gl/docs/api-reference/actions/actions#updatemap
 * @param data an array of data, where each entry in the array is a row in a data table, with column values in order.
 *  Each row might contain more than one lat/long coordinate pair.
 * @param columnIndicesToUseForLatLongPoints and array of tuples, where each tuple is the column indexes (indexed from 0)
 *  of a latitude column then longitude column that can be used to retrieve a lat / long point from that row.
 * For example, a row with a begin lat/long point in cols 4 and 5 and an end point in cols 7 and 8, could be passed in as
 *  tuples e.g. [ [X1,Y1], [X2,Y2], ... ] where each tuple is a column index for retrieving a latitude (Xn) followed by a
 *  column index for retrieving the corresponding longitude (Yn)
 * @param viewportProps an object with any viewport properties you want to include
 * @return {Object} a viewport object in the same format that KeplerGL's updateMap requires -
 */
function getBestViewport(
  data,
  columnIndicesToUseForLatLongPoints,
  viewportProps = {}
) {
  // Initialize variables for min and max latitude and longitude
  let minLat = Infinity,
    maxLat = -Infinity,
    minLon = Infinity,
    maxLon = -Infinity

  // Iterate through rows and column pairs to find the min and max latitude and longitude
  for (const row of data) {
    for (const columnNamePair of columnIndicesToUseForLatLongPoints) {
      const lat = row[columnNamePair[0]]
      const lon = row[columnNamePair[1]]

      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      minLon = Math.min(minLon, lon)
      maxLon = Math.max(maxLon, lon)
    }
  }

  // Calculate the center point of the bounding box
  const centreLat = (minLat + maxLat) / 2
  const centreLon = (minLon + maxLon) / 2

  // Calculate the zoom level based on the size of the bounding box
  const latZoom = Math.log2(360 / (maxLat - minLat))
  const lonZoom = Math.log2(360 / (maxLon - minLon))
  const zoom = Math.min(latZoom, lonZoom)

  // Return the viewport object
  return {
    ...viewportProps,
    latitude: centreLat,
    longitude: centreLon,
    zoom: zoom
  }
}

export default getBestViewport
