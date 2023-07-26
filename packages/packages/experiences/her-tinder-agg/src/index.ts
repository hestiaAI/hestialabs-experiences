import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './her-tinder-agg-viewer.json'
import databaseConfig from './database'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  databaseConfig,
  files: {
    herLikeMatch: 'her**/block03.json',
    herLikeSkip: 'her**/block01.json',
    herMessage: 'her**/block04.json',
    tinderUsage: 'tinder**/block04.json',
    tinderUser: 'tinder**/block00.json'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url
)
