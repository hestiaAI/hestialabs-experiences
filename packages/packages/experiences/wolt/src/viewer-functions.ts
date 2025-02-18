import { customPipelineGetFirstCSV } from '@/pipelines/custom'
import { courierTasksPostProcessor } from './postprocessor'

const viewerFunctions = {
  customPipelines: {
    csv_tasks: customPipelineGetFirstCSV('courier_tasks')
  },
  postprocessors: {
    courierTasksPostProcessor
  }
}

export default viewerFunctions
