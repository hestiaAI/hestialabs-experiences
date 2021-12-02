import { genericDateViewer } from '~/manifests/generic-pipelines'

async function viewingData(fileManager) {
  return await fileManager.getCsvItems(
    'CONTENT_INTERACTION/ViewingActivity.csv'
  )
}
export default { genericDateViewer, viewingData }
