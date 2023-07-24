import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './apple-tracker-agg-viewer.json'
import databaseConfig from './database'
import baseOptions from '../../apple-tracker/src/index'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  ...baseOptions.options,
  databaseConfig,
  files: {
    network: '**/block00.json',
    access: '**/block01.json'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url
)
