import { customPipelineMergeCSV } from '@/pipelines/custom'
const viewerFunctions = {
  postprocessors: {},
  customPipelines: {
    csv_inference: customPipelineMergeCSV('inference'),
    csv_ad_targeting: customPipelineMergeCSV('ad-targeting'),
    csv_connections: customPipelineMergeCSV('connections')
  }
}
export default viewerFunctions
