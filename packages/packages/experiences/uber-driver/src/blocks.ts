import { customPipelineGetFirstCSV } from '@/pipelines/custom'
import { getMockupData } from './preprocessor'
import type { ViewBlocks } from '@/types'
import {
  driverTripsPostProcessor,
  driverHeatMapPostProcessor,
  driverRestrictionsPostProcessor,
  driverOnOffPostProcessor,
  driverPointsPostProcessor
} from './postprocessor'

import keplerConfigOnOff from './kepler/kepler_config_onlineOffline'
import keplerConfigHeatMap from './kepler/kepler_config_heatmap'
import keplerConfigRestrictions from './kepler/kepler_config_restriction'
import keplerConfigPoints from './kepler/kepler_config_points'

const blocks: ViewBlocks = [
  {
    id: 'driverHeatMap',
    customPipeline: customPipelineGetFirstCSV('driver_on_off'),
    files: ['driver_on_off'],
    postprocessor: driverHeatMapPostProcessor,
    visualization: 'ChartViewGenericMap.vue',
    vizProps: {
      keplerConfig: keplerConfigHeatMap
    },
    title: 'Hot areas',
    text: '< TO DEFINE IN TRANSLATIONS >',
    showTable: false
  },
  {
    id: 'driverTrips',
    customPipeline: customPipelineGetFirstCSV('driver_trips'),
    files: ['driver_trips'],
    title: 'Trips',
    postprocessor: driverTripsPostProcessor,
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          title: 'Number of trips',
          valueLabel: 'trips',
          cols: '12',
          type: 'BarTimelineChart.vue',
          dateAccessor: 'begin_date'
        },
        {
          valueLabel: 'trips',
          type: 'WeekChart.vue',
          cols: '4',
          dateAccessor: 'begin_date'
        },
        {
          valueLabel: 'trips',
          type: 'HourChart.vue',
          cols: '4',
          dateAccessor: 'begin_date'
        },
        {
          valueLabel: 'trips',
          title: 'Status of the trip',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'status'
        }
      ]
    },
    text: '< TO DEFINE IN TRANSLATIONS >',
    showTable: false
  },
  {
    id: 'driverTrips_0',
    customPipeline: customPipelineGetFirstCSV('driver_trips_0'),
    files: ['driver_trips_0'],
    title: 'Trips',
    text: '< TO DEFINE IN TRANSLATIONS >',
    showTable: true
  },
  {
    id: 'driverOnOff',
    customPipeline: customPipelineGetFirstCSV('driver_on_off'),
    postprocessor: driverOnOffPostProcessor,
    files: ['driver_on_off'],
    visualization: 'ChartViewGenericMap.vue',
    vizProps: {
      keplerConfig: keplerConfigOnOff
    },
    title: 'Driver Status',
    text: '< TO DEFINE IN TRANSLATIONS >',
    showTable: false
  },
  {
    id: 'driverRestrictions',
    customPipeline: customPipelineGetFirstCSV('driver_app_restrictions'),
    postprocessor: driverRestrictionsPostProcessor,
    files: ['driver_app_restrictions'],
    visualization: 'ChartViewGenericMap.vue',
    vizProps: {
      keplerConfig: keplerConfigRestrictions
    },
    title: 'Restrictions',
    text: '< TO DEFINE IN TRANSLATIONS >',
    showTable: false
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
    id: 'driverAppAnalytics',
    customPipeline: customPipelineGetFirstCSV('driver_app_analytics'),
    files: ['driver_app_analytics'],
    visualization: 'ChartViewGenericMap.vue',
    title: 'GPS',
    text: '< TO DEFINE IN TRANSLATIONS >',
    postprocessor: driverPointsPostProcessor,
    vizProps: {
      keplerConfig: keplerConfigPoints
    }
  },
  {
    id: 'driverAccounting',
    customPipeline: getMockupData,
    title: 'Accounting (Mockup)',
    text: 'Compute your expenses and estimated wages.',
    visualization: 'ChartViewUberDriverAccounting.vue',
    overlay: true
  }
]

export default blocks
