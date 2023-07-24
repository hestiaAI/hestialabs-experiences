import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerFunctions from './viewer-functions'
import viewerOptions from './uber-driver-viewer.json'

const loaderOptions: LoaderOptions = {
  files: {
    driver_on_off: '**/*Driver Online Offline.csv',
    driver_performances: '**/*Driver Performance Badges.csv',
    driver_app_restrictions: '**/*Driver App Restrictions.csv',
    driver_dispatches: '**/*Driver Dispatches Offered and Accepted.csv',
    driver_trips: '**/*Driver Lifetime Trips*.csv',
    driver_payments: '**/(driver_payments-0.csv|*- Driver Payments*.csv)',
    driver_app_analytics:
      '**/(driver_app_analytics-0.csv|*Driver Detailed*.csv)',
    driver_trips_0: '**/(driver_lifetime_trips-0.csv|Trip*.csv)'
  },
  keepOnlyFiles: false
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)
