import { customPipelineGetFirstCSV } from '@/pipelines/custom'
const viewerFunctions = {
  postprocessors: {},
  customPipelines: {
    csv_viewing_activity: customPipelineGetFirstCSV('viewing-activity'),
    csv_messages_by_netflix: customPipelineGetFirstCSV('messages-by-netflix')
  }
}

export default viewerFunctions
