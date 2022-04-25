import { Experience, ExperienceOptions } from '@/index'
import { theDatingPrivacyCollective } from '@/collaborators/index'
import icon from '@/icons/her.png'
import defaultView from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  collaborator: theDatingPrivacyCollective,
  databaseConfig,
  dataPortal: 'https://weareher.com/privacy/',
  defaultView,
  files: {
    liked: '**/liked.csv',
    notifications: '**/notifications.csv',
    blocked: '**/blocked.csv',
    messages: '**/messages.csv',
    reported: '**/reported.csv',
    skipped: '**/skipped.csv',
    profiles: '**/profiles.csv'
  },
  icon: icon,
  slug: 'her',
  title: 'HER'
}

export default new Experience(options)
