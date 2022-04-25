import { Experience, ExperienceOptions } from '@/index'
import { linkedinConnections } from './preprocessor'
import icon from '@/icons/linkedin.png'
import defaultView from './blocks'

const options: ExperienceOptions = {
  dataPortal:
    'https://www.linkedin.com/help/linkedin/answer/50191/downloading-your-account-data',
  defaultView,
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
  title: 'LinkedIn'
}

export default new Experience(options)
