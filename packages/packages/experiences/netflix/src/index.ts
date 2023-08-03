import packageJSON from '../package.json'
import viewerFunctions from './viewer-functions'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './netflix-viewer.json'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  files: {
    'viewing-activity': '**/CONTENT_INTERACTION/ViewingActivity.csv',
    'messages-by-netflix': '**/MESSAGES/MessagesSentByNetflix.csv'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)
