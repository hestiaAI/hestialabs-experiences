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
  dataSamples: ['tinder-synthetic.json'],
  files: {
    herLikeMatch: 'her_*/block03.json',
    herLikeSkip: 'her_*/block01.json',
    herMessage: 'her_*/block04.json',
    tinderUsage: 'tinder_*/block04.json',
    tinderUser: 'tinder_*/block00.json'
  },
  icon: icon,
  slug: 'her-tinder',
  title: 'Her + Tinder',
  viewBlocks
}

export default new Experience(options)
