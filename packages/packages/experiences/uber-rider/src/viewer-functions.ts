import { customPipelineGetFirstCSV } from '@/pipelines/custom'
import { getMockupData } from './preprocessor'

import {
  driverTripsPostProcessor,
  driverHeatMapPostProcessor,
  driverRestrictionsPostProcessor,
  driverOnOffPostProcessor,
  driverPointsPostProcessor
} from './postprocessor'

const viewerFunctions = {
  postprocessors: {
    driverTripsPostProcessor,
    driverHeatMapPostProcessor,
    driverRestrictionsPostProcessor,
    driverOnOffPostProcessor,
    driverPointsPostProcessor
  },
  customPipelines: {
    csv_driver_on_off: customPipelineGetFirstCSV('driver_on_off'),
    csv_driver_trips: customPipelineGetFirstCSV('driver_trips'),
    csv_driver_trips_0: customPipelineGetFirstCSV('driver_trips_0'),
    csv_driver_app_restrictions: customPipelineGetFirstCSV(
      'driver_app_restrictions'
    ),
    csv_driver_payments: customPipelineGetFirstCSV('driver_payments'),
    csv_driver_app_analytics: customPipelineGetFirstCSV('driver_app_analytics'),
    getMockupData: getMockupData
  }
}

export default viewerFunctions
