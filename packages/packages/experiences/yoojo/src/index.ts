import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './yoojo-viewer.json'
import viewerFunctions from './viewer-functions'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  files: {
    // Yoojo's export is named data_jobs_<account id>.csv
    jobs: '**/data_jobs_*.csv'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)
