import { Experience, ExperienceOptions } from '@/index'
import { linkedinConnections } from './preprocessor'
import icon from '@/icons/linkedin.png'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  dataPortal:
    'https://www.linkedin.com/help/linkedin/answer/50191/downloading-your-account-data',
  files: {
    inference: '**/Inferences_about_you.csv',
    'ad-targeting': '**/Ad_Targeting.csv',
    connections: '**/Connections.csv'
  },
  hideFileExplorer: false,
  icon: icon,
  preprocessors: {
    '**/Connections.csv': linkedinConnections
  },
  slug: 'linkedin',
  title: 'LinkedIn',
  viewBlocks
}

export default new Experience(options)
