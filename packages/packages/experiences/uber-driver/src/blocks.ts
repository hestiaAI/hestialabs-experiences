import { customPipelineGetFirstCSV } from '@/pipelines/custom'
import { getMockupData } from './preprocessor'
import type { ViewBlocks } from '@/types'
import {
  driverTripsPostProcessor,
  driverPointsPostProcessor,
  riderTripsPostProcessor,
  riderPointsPostProcessor
} from './postprocessor'
import keplerConfigPlaces from './kepler/kepler_config_places'
import keplerConfigTrips from './kepler/kepler_config_trip'
import keplerConfigTripDrivers from './kepler/kepler_config_trip_drivers'
import keplerConfigNonTrip from './kepler/kepler_config_non_trip'

const blocks: ViewBlocks = [
  {
    id: 'driverTrips',
    customPipeline: customPipelineGetFirstCSV('driver_trips'),
    files: ['driver_trips'],
    title: 'Driver Trips',
    postprocessor: driverTripsPostProcessor,
    visualization: 'ChartViewGenericMap.vue',
    vizProps: {
      keplerConfig: keplerConfigTripDrivers,
      label: 'trips'
    },
    text: '',
    showTable: false
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
  },
  {
    id: 'driverNonTrip',
    customPipeline: customPipelineGetFirstCSV('non_trip'),
    files: ['rider_points'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'Driver Time Lost',
    text: '',
    vizProps: {
      keplerConfig: keplerConfigNonTrip,
      label: 'in between trips'
    }
  },
  {
    id: 'driverAccounting',
    customPipeline: getMockupData,
    files: ['rider_points'],
    title: 'Accounting (Mockup)',
    text: 'Compute your expenses and estimated wages.',
    visualization: 'ChartViewUberDriverAccounting.vue',
    overlay: 'This feature is under development'
  }
]

export default blocks
