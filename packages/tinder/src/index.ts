import { Experience, ExperienceOptions } from 'shared/index'
import { theDatingPrivacyCollective } from 'collaborators/index'
import defaultView from './blocks'
import preprocessor from 'preprocessors/tinder'
import icon from 'icons/tinder.png'
import yarrrml from './tinder.yml'

const options: ExperienceOptions = {
  allowMissingFiles: true,
  collaborator: theDatingPrivacyCollective,
  dataPortal: 'https://account.gotinder.com/data',
  defaultView,
  fileExtensions: ['json'],
  icon: icon,
  preprocessor,
  slug: 'tinder',
  title: 'Tinder',
  yarrrml,
  zipFilePaths: ['input.json']
}

export default new Experience(options)
