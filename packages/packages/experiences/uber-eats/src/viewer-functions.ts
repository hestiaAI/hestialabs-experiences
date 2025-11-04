import { customPipelineGetFirstCSV } from '@/pipelines/custom'
import type { FileManager } from '@/types/utils'
import keplerConfig from './kepler-config'

async function driverOnlineOfflineData({ fileManager }: { fileManager: FileManager }) {
  const data = (await fileManager.getCsvItemsFromId('DriverOnlineOffline'))[0] ?? { headers: [], items: [] }
  return data
}

async function driverPaymentsData({ fileManager }: { fileManager: FileManager }) {
  const data = (await fileManager.getCsvItemsFromId('DriverPayments'))[0] ?? { headers: [], items: [] }
  return data
}

async function courierTripsData({ fileManager }: { fileManager: FileManager }) {
  const rawCsv = (await fileManager.getPreprocessedTextFromId('CourierLifetimeTripData'))[0]
  return { rawCsv, config: keplerConfig }
}

const viewerFunctions = {
  postprocessors: {},
  customPipelines: {
    csv_driverOnlineOffline: driverOnlineOfflineData,
    csv_driverPayments: driverPaymentsData,
    csv_courierTrips: courierTripsData
  }
}

export default viewerFunctions
