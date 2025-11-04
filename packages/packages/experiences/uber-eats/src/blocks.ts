import { genericDateViewer } from '@/pipelines/generic'
import type { ViewBlocks } from '@/types'

const blocks: ViewBlocks = [
  {
    id: 'driverOnlineOffline',
    customPipeline: 'csv_driverOnlineOffline',
    files: ['DriverOnlineOffline'],
    visualization: 'ChartViewOverview.vue',
    title: 'Driver online/offline status',
    text: 'Shows the online/offline status periods of the driver.'
  },
  {
    id: 'driverPayments',
    customPipeline: 'csv_driverPayments',
    files: ['DriverPayments'],
    visualization: 'ChartViewPayments.vue',
    title: 'Payments overview',
    text: 'Visualizes the driver payment details over time.'
  },
  {
    id: 'courierTrips',
    customPipeline: 'csv_courierTrips',
    files: ['CourierLifetimeTripData'],
    visualization: '/kepler',
    title: 'Map of deliveries',
    text: 'Shows the courier delivery trips on a map.'
  },
  genericDateViewer
]

export default blocks
