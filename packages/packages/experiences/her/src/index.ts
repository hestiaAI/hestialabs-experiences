import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './her-viewer.json'
import databaseConfig from './database'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  databaseConfig,
  files: {
    liked: '**/liked.csv',
    notifications: '**/notifications.csv',
    blocked: '**/blocked.csv',
    messages: '**/messages.csv',
    reported: '**/reported.csv',
    skipped: '**/skipped.csv',
    profiles: '**/profiles.csv'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url
)
