import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import { theDatingPrivacyCollective } from '@/collaborators/index'
import icon from '@/icons/tinder.png'
import viewBlocks from './blocks'
import databaseConfig from './database'
import messages from './messages.json'

const options: ExperienceOptions = {
  collaborator: theDatingPrivacyCollective,
  databaseConfig,
  dataPortal: 'https://account.gotinder.com/data',
  dataSamples: ['tinder-synthetic.json'],
  files: {
    tinder: '**/*.json'
  },
  icon,
  messages,
  title: 'Tinder',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
