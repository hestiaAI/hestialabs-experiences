import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/linkedin.png'
import viewBlocks from './blocks'
import messages from './messages.json'
import { theEyeballs } from '@/collaborators/index'
import databaseConfig from './database'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  databaseConfig,
  files: {
    inference: '**/block00.json',
    'ad-targeting': '**/block01.json',
    connection: '**/block02.json'
  },
  hideFileExplorer: false,
  icon,
  messages,
  title: 'Collective LinkedIn experience',
  subtitle: 'Unlock the power of Linkedin data',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
