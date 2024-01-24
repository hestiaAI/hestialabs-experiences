import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './database-template-viewer.json'
import databaseConfig from './database'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  databaseConfig,
  files: {
    courier_tasks: '**/courier_tasks.csv'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url
)
