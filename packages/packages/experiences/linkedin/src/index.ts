import packageJSON from '../package.json'
import viewerFunctions from './viewer-functions'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './linkedin-viewer.json'
import { linkedinConnections } from './preprocessor'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  // 'https://www.linkedin.com/help/linkedin/answer/50191/downloading-your-account-data',
  files: {
    inference: '**/Inferences_about_you.csv',
    'ad-targeting': '**/Ad_Targeting.csv',
    connections: '**/Connections.csv'
  },
  keepOnlyFiles: false,
  preprocessors: {
    '**/Connections.csv': linkedinConnections
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)
