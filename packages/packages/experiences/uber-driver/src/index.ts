import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/uber.png'
import viewBlocks from './blocks'
import messages from './messages.json'
import dataSample from '@/data-samples/uber-driver-fr-paris.zip'

const options: ExperienceOptions = {
  dataPortal: 'https://myprivacy.uber.com/privacy/exploreyourdata/download',
  dataSamples: [dataSample],
  hideFileExplorer: false,
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
  keepOnlyFiles: false,
  hideEmptyTabs: true,
  icon,
  messages,
  title: 'Uber Driver',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
