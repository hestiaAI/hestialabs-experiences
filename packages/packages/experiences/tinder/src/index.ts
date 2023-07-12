import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import { theDatingPrivacyCollective } from '@/collaborators/index'
import icon from '@/icons/tinder.png'
import viewBlocks from './blocks'
import databaseConfig from './database'
import messages from './messages.json'
import dataSample from '@/data-samples/tinder.json'

const options: ExperienceOptions = {
  collaborator: theDatingPrivacyCollective,
  databaseConfig,
  dataPortal: 'https://account.gotinder.com/data',
  dataSamples: [dataSample],
  files: {
    tinder: '**/*.json'
  },
  icon,
  messages,
  title: 'Tinder',
  viewBlocks
}

export default new Experience(options, undefined, packageJSON, import.meta.url)
