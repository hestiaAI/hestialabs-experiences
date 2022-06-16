import { Experience, ExperienceOptions } from '@/index'
import { theDatingPrivacyCollective } from '@/collaborators/index'
import icon from '@/icons/tinder.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  collaborator: theDatingPrivacyCollective,
  databaseConfig,
  dataPortalHtml:
    'Please upload your archives from Tinder and Her below and analyse them here.',
  files: {
    herLikeMatch: 'her**/block03.json',
    herLikeSkip: 'her**/block01.json',
    herMessage: 'her**/block04.json',
    tinderUsage: 'tinder**/block04.json',
    tinderUser: 'tinder**/block00.json'
  },
  icon: icon,
  slug: 'her-tinder',
  title: 'Her + Tinder',
  hideFileExplorer: false,
  viewBlocks
}

export default new Experience(options)
