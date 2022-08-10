import { customPipelineGetFirstCSV } from '@/pipelines/custom'
import type { ViewBlocks } from '@/types'
import {
  driverTripsPostProcessor,
  driverPointsPostProcessor,
  riderTripsPostProcessor,
  riderPointsPostProcessor
} from './postprocessor'
import keplerConfigPlaces from './kepler/kepler_config_places'
import keplerConfigTrips from './kepler/kepler_config_trip'

const blocks: ViewBlocks = [
  {
    id: 'driverTrips',
    customPipeline: customPipelineGetFirstCSV('driver_trips'),
    files: ['driver_trips'],
    title: 'Driver Trips',
    postprocessor: driverTripsPostProcessor,
    text: '',
    visualization: 'ChartViewOverviewUber.vue'
  },
  {
    id: 'driverPoints',
    customPipeline: customPipelineGetFirstCSV('driver_points'),
    files: ['driver_points'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Driver Points',
    text: '',
    postprocessor: driverPointsPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigPlaces,
      label: 'data-points'
    }
  },
  {
    id: 'driverPayments',
    customPipeline: customPipelineGetFirstCSV('driver_payments'),
    files: ['driver_payments'],
    title: 'Driver Payments',
    text: '',
    showTable: true
  },
  {
    id: 'riderTrips',
    customPipeline: customPipelineGetFirstCSV('rider_trips'),
    files: ['rider_trips'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Rider Trips',
    text: '',
    postprocessor: riderTripsPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigTrips,
      label: 'trips'
    }
  },
  {
    id: 'riderPoints',
    customPipeline: customPipelineGetFirstCSV('rider_points'),
    files: ['rider_points'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Rider Points',
    text: '',
    postprocessor: riderPointsPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigPlaces,
      label: 'data-points'
    }
  }
]

export default blocks
