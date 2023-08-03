import packageJSON from '../package.json'
import viewerFunctions from './viewer-functions'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './uber-viewer.json'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  files: {
    trips: '**/Rider/trips_data.csv'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)
