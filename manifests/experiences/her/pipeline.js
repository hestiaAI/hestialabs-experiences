import { genericDateViewer } from '~/manifests/generic-pipelines'
import { getCsvAndMergeFromID } from '~/utils/csv'

async function fetchLiked({ fileManager }) {
  return await getCsvAndMergeFromID(fileManager, 'liked')
}

export default { fetchLiked, genericDateViewer }
