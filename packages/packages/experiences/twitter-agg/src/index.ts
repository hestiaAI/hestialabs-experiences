import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './twitter-agg-viewer.json'
import preprocessor from './preprocessor'
import databaseConfig from './database'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  databaseConfig,
  files: {
    ads: '**/block00.json',
    adsLastMonth: '**/block01.json',
    targeting: '**/block05.json',
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
  import.meta.url
)
