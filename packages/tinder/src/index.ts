import { Experience, ExperienceOptions } from 'shared/index'
import { theDatingPrivacyCollective } from 'collaborators/index'
import preprocessor from 'preprocessors/tinder'
import icon from 'icons/tinder.png'

const options: ExperienceOptions = {
  allowMissingFiles: true,
  collaborator: theDatingPrivacyCollective,
  dataPortal: 'https://account.gotinder.com/data',
  fileExtensions: ['json'],
  icon: icon,
  preprocessor,
  slug: 'tinder',
  title: 'Tinder',
  zipFilePaths: ['input.json']
}

export default new Experience(options)
