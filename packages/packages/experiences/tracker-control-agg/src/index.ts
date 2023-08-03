import packageJSON from '../package.json'
import viewerFunctions from './viewer-functions'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './tracker-control-agg-viewer.json'
import databaseConfig from './database'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  databaseConfig,
  files: {
    'tracker-control': '**/block00.json'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)
