import packageJSON from '../package.json'
import viewerFunctions from './viewer-functions'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './twitter-viewer.json'
import preprocessor from './preprocessor'
import databaseConfig from './database'
import dataModel from './model/model.json'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  databaseConfig,
  dataModel,
  files: {
    impressions: '**/ad-impressions.js',
    engagements: '**/ad-engagements.js',
    personalization: '**/personalization.js'
  },
  preprocessors: {
    '**/*.js': preprocessor
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)
