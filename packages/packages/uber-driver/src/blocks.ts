import { customPipelineGetFirstCSV } from '@/pipelines/custom'
import type { ViewBlocks } from '@/types'
import {
  driverPostProcessor,
  riderPostProcessor,
  tripsPostProcessor
} from './postprocessor'
import keplerConfigPlaces from './kepler/kepler_config_places'
import keplerConfigTrips from './kepler/kepler_config_trip'

const blocks: ViewBlocks = [
  {
    id: 'driverData',
    customPipeline: customPipelineGetFirstCSV('driver'),
    files: ['driver'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Driver Data',
    text: '',
    postprocessor: driverPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigPlaces
    }
  },
  {
    id: 'riderData',
    customPipeline: customPipelineGetFirstCSV('rider'),
    files: ['rider'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Rider Data',
    text: '',
    postprocessor: riderPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigPlaces
    }
  },
  {
    id: 'trips',
    customPipeline: customPipelineGetFirstCSV('trips'),
    files: ['trips'],
    visualization: 'ChartViewUberDriverTrips.vue',
    title: 'Trips',
    text: '',
    postprocessor: tripsPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigTrips,
      label: 'trips'
    }
  }
]

export default blocks
