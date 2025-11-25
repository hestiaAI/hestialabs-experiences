import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './babysits-viewer.json'
import viewerFunctions from './viewer-functions'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  files: {
    BabysitterJobs: '**/data_jobs_1234567.csv'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions,
)
