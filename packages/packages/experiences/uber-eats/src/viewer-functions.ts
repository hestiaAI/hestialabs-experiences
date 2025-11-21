import type { FileManager } from '@/types/utils'
import keplerConfig from './kepler-config'

// return parsed CSV (headers + items) for DriverOnlineOffline
async function csv_driver_online({ fileManager }: { fileManager: FileManager }) {
  const csv =
    (await fileManager.getCsvItemsFromId("DriverOnlineOffline"))[0] ?? {
      headers: [],
      items: [],
    };

  const items = csv.items.map(row => {
    const begin = row.beginTimestampLocal;
    const end = row.endTimestempLocal;

    const hours = row.durationMs
      ? Number(row.durationMs) / 1000 / 3600
      : null;

    return {
      begin,
      end,
      hours,
    };
  });

  return {
    headers: ["begin", "end", "hours"],
    items
  };
}

// driver payments CSV
async function csv_driver_payments({ fileManager }: { fileManager: FileManager }) {
  return (await fileManager.getCsvItemsFromId('DriverPayments'))[0] ?? { headers: [], items: [] }
}

// courier trips for kepler (return rawCsv + kepler config)
async function csv_courier_trips({ fileManager }: { fileManager: FileManager }) {
  const rawCsv = (await fileManager.getPreprocessedTextFromId('CourierLifetimeTripData'))[0]
  return { rawCsv, config: keplerConfig }
}

const viewerFunctions = {
  postprocessors: {
    // add named postprocessors if needed
  },
  customPipelines: {
    csv_driver_online,
    csv_driver_payments,
    csv_courier_trips
  }
}

export default viewerFunctions
