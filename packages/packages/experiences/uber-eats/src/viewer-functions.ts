import type { FileManager } from '@/types/utils'
import keplerConfig from './kepler-config'

let periodStart = "2025-03-24";
let periodEnd = "2025-03-30";
let initialMode = "week";

async function combined_data_pipeline({ fileManager }: { fileManager: FileManager }) {
  // Get driver online/offline
  const driverOnlineCsv =
    (await fileManager.getCsvItemsFromId("DriverOnlineOffline"))[0] ?? {
      headers: [],
      items: [],
    };

  const onlineItems = driverOnlineCsv.items.map(row => {
    const begin = row.beginTimestampLocal;
    const end = row.endTimestampLocal;
    const hours = row.durationMs ? Number(row.durationMs) / 1000 / 3600 : null;
    const state = row.earnerState;

    return { begin, end, hours, state };
  });

  // Get driver payments
  const payments =
    (await fileManager.getCsvItemsFromId("DriverPayments"))[0] ?? {
      headers: [],
      items: [],
    };

  // Get trip data
  const trips =
    (await fileManager.getCsvItemsFromId("CourierLifetimeTripData"))[0] ?? {
      headers: [],
      items: [],
    };

  return {
    headers: ["online", "payments", "trips"],
    items: [
      {
        online: { headers: ["begin", "end", "hours"], items: onlineItems },
        payments,
        trips,
        props: { periodStart, periodEnd, initialMode }
      }
    ]
  };
}


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
  const csv =
    (await fileManager.getCsvItemsFromId("CourierLifetimeTripData"))[0] ?? { headers: [], items: [] };

  return {
    headers: ["trips"],
    items: [
      {
        trips: csv,
        props: { periodStart, periodEnd, initialMode }
      }
    ]
  };
}

const viewerFunctions = {
  postprocessors: {
    // add named postprocessors if needed
  },
  customPipelines: {
    combined_data_pipeline,
    csv_driver_online,
    csv_driver_payments,
    csv_courier_trips
  }
}

export default viewerFunctions
