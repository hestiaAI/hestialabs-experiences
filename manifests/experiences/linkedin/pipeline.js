import { genericDateViewer } from '~/manifests/generic-pipelines'
import { getCsvAndMergeFromID } from '~/utils/csv'

async function inference({ fileManager }) {
  return await getCsvAndMergeFromID(fileManager, 'inference')
}

async function adTargeting({ fileManager }) {
  return await getCsvAndMergeFromID(fileManager, 'ad-targeting')
}

async function connections({ fileManager }) {
  return await getCsvAndMergeFromID(fileManager, 'connections')
}

export default { adTargeting, inference, connections, genericDateViewer }
