import type { FileManager, PipelineOutput } from '@/types/utils'

/* Shallow equality test on sets */
function setsEqual<T>(s1: Set<T>, s2: Set<T>) {
  return s1.size === s2.size && [...s1].every(value => s2.has(value))
}

/**
 * Retrieve the csvs that match the fileID and merge them into one array
 * @param {*} fileManager The fileManager instance that store the files and files IDs
 * @param {*} fileID The corresponding key that link to the globPath we seek, defined in the manifest under files.
 * @returns the merged csvs array
 */
export async function getCsvAndMergeFromID(
  fileManager: FileManager,
  fileID: string
): Promise<PipelineOutput> {
  const files = await fileManager.getCsvItemsFromId(fileID)

  if (!files.length) {
    return {
      headers: [],
      items: []
    }
  }

  // Merge the files that have the same headers as the first file
  const file = files
    .slice(1)
    .reduce((prev: PipelineOutput, curr: PipelineOutput) => {
      if (setsEqual(new Set(prev.headers), new Set(curr.headers))) {
        return { headers: prev.headers, items: prev.items.concat(curr.items) }
      } else {
        return prev
      }
    }, files[0])
  return file
}

export const customPipelineMergeCSV =
  (fileId: string) => async (params: { fileManager: FileManager }) =>
    await getCsvAndMergeFromID(params.fileManager, fileId)

export const customPipelineGetFirstCSV =
  (fileId: string) => async (params: { fileManager: FileManager }) =>
    (await params.fileManager.getCsvItemsFromId(fileId))[0] || {
      headers: [],
      items: []
    }
