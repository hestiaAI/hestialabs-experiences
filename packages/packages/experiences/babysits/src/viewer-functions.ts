import type { FileManager } from '@/types/utils'

// return parsed CSV (headers + items) for DriverOnlineOffline
async function csv_babysitter_jobs({ fileManager }: { fileManager: FileManager }) {
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

const viewerFunctions = {
  postprocessors: {
    // add named postprocessors if needed
  },
  customPipelines: {
    csv_babysitter_jobs
  }
}

export default viewerFunctions
