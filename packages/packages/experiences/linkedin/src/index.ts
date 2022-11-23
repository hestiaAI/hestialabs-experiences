import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import { linkedinConnections } from './preprocessor'
import icon from '@/icons/linkedin.png'
import viewBlocks from './blocks'
import messages from './messages.json'
import dataSample from '@/data-samples/linkedin.zip'

const options: ExperienceOptions = {
  dataPortal:
    'https://www.linkedin.com/help/linkedin/answer/50191/downloading-your-account-data',
  dataSamples: [dataSample],
  files: {
    inference: '**/Inferences_about_you.csv',
    'ad-targeting': '**/Ad_Targeting.csv',
    connections: '**/Connections.csv'
  },
  hideFileExplorer: false,
  icon,
  messages,
  keepOnlyFiles: false,
  preprocessors: {
    '**/Connections.csv': linkedinConnections
  },
  title: 'LinkedIn',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
