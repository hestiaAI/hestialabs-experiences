import { genericDateViewer } from '~/manifests/generic-pipelines'

async function viewingData(fileManager) {
  return await fileManager.getCsvItems(
    'CONTENT_INTERACTION/ViewingActivity.csv'
  )
}

async function messagesData(fileManager) {
  return await fileManager.getCsvItems('MESSAGES/MessagesSentByNetflix.csv')
}
export default { genericDateViewer, viewingData, messagesData }
