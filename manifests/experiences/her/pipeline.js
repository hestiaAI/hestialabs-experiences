import { genericDateViewer } from '~/manifests/generic-pipelines'
import { getCsvAndMergeFromID } from '~/utils/csv'

async function inference({ fileManager }) {
  return await getCsvAndMergeFromID(fileManager, 'inference')
}

async function adTargeting({ fileManager }) {
  return await getCsvAndMergeFromID(fileManager, 'ad-targeting')
}

export default { adTargeting, inference, genericDateViewer }
