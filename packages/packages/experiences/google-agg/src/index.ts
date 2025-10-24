import packageJSON from '../package.json'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './google-agg-viewer.json'
import databaseConfig from './database'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  databaseConfig,
  files: {
    placeVisited: '**/block00.json',
    otherCandidate: '**/block02.json',
    travels: '**/block03.json',
    records: '**/block04.json',
    wifi: '**/block05.json',
    consent: '**/consent.json'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url
)
