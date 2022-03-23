import { genericDateViewer } from '~/manifests/generic-pipelines'
import { setsEqual } from '~/utils/utils'

async function inference({ fileManager }) {
  const tcFiles = await fileManager.getCsvItemsFromId('inference')

  // Merge the files that have the same headers as the first file
  const tcFile = tcFiles.reduce((prev, curr) => {
    if (setsEqual(new Set(prev.headers), new Set(curr.headers))) {
      return { headers: prev.headers, items: prev.items.concat(curr.items) }
    } else {
      return prev
    }
  })
  return tcFile
}

export default { inference, genericDateViewer }
