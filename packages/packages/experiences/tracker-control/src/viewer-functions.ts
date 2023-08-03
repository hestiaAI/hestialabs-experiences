import { customPipelineMergeCSV } from '@/pipelines/custom'
const viewerFunctions = {
  postprocessors: {},
  customPipelines: {
    csv_tracker_control: customPipelineMergeCSV('tracker-control')
  }
}

export default viewerFunctions
