import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './uber-eats-viewer.json'
import viewerFunctions from './viewer-functions'

const loaderOptions: LoaderOptions = {
    viewerVersion: 1,
    files: {
        status: '**/Driver Online Offline.csv',
        payments: '**/Driver Payments.csv',
        trips: '**/Courier Lifetime Trip Data.csv'
    }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)
