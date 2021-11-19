async function tripsData(fileManager) {
  return await fileManager.getCsvItems('Uber Data/Rider/trips_data.csv')
}

async function rawTripsData(fileManager) {
  return await fileManager.getText('Uber Data/Rider/trips_data.csv')
}

export default {
  tripsData,
  rawTripsData
}
