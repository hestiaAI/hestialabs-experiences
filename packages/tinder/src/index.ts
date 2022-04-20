import { Experience, ExperienceOptions } from 'shared/index'
import { theDatingPrivacyCollective } from 'collaborators/index'
import defaultView from './blocks'
import icon from 'icons/tinder.png'

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
