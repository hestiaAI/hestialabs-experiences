import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import { theDatingPrivacyCollective } from '@/collaborators/index'
import icon from '@/icons/her.png'
import viewBlocks from './blocks'
import databaseConfig from './database'
import dataSample from '@/data-samples/her.zip'

const options: ExperienceOptions = {
  collaborator: theDatingPrivacyCollective,
  databaseConfig,
  dataPortal: 'https://weareher.com/privacy/',
  dataSamples: [dataSample],
  files: {
    liked: '**/liked.csv',
    notifications: '**/notifications.csv',
    blocked: '**/blocked.csv',
    messages: '**/messages.csv',
    reported: '**/reported.csv',
    skipped: '**/skipped.csv',
    profiles: '**/profiles.csv'
  },
  icon,
  title: 'HER',
  viewBlocks
}

export default new Experience(options, options, packageJSON, import.meta.url)
