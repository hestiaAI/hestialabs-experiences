import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import { theDatingPrivacyCollective } from '@/collaborators/index'
import icon from '@/icons/tinder.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  collaborator: theDatingPrivacyCollective,
  databaseConfig,
  files: {
    herLikeMatch: 'her**/block03.json',
    herLikeSkip: 'her**/block01.json',
    herMessage: 'her**/block04.json',
    tinderUsage: 'tinder**/block04.json',
    tinderUser: 'tinder**/block00.json'
  },
  icon,
  title: 'Her + Tinder',
  hideFileExplorer: false,
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
