import { genericDateViewer } from '~/manifests/generic-pipelines'

async function tripsData(fileManager) {
  return await fileManager.getCsvItems('Uber Data/Rider/trips_data.csv')
}

export default {
  tripsData,
  genericDateViewer
}
