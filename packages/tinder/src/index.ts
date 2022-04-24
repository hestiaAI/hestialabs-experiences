import { Experience, ExperienceOptions } from '@/index'
import { theDatingPrivacyCollective } from '@/collaborators/index'
import icon from '@/icons/tinder.png'

import defaultView from './blocks'

const options: ExperienceOptions = {
  collaborator: theDatingPrivacyCollective,
  dataPortal: 'https://account.gotinder.com/data',
  dataSamples: ['tinder-synthetic.json'],
  defaultView,
  files: {
    tinder: '**/*.json'
  },
  icon: icon,
  slug: 'tinder',
  title: 'Tinder'
}

export default new Experience(options)
