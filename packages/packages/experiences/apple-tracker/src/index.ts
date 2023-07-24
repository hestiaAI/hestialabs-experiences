import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './apple-tracker-viewer.json'
import databaseConfig from './database'
import ndjsonToJson from './preprocessor'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  databaseConfig,
  files: {
    'tracker-control-ios': '**/*.ndjson'
  },
  preprocessors: {
    '**/*.ndjson': ndjsonToJson
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url
)
