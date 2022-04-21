import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from 'collaborators/index'
import preprocessor from 'preprocessors/facebook'
import icon from 'icons/facebook.png'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  dataPortal: 'https://www.facebook.com/help/212802592074644',
  defaultView: [],
  icon: icon,
  preprocessors: {
    '**/*.json': preprocessor
  },
  slug: 'facebook',
  title: 'Facebook'
}

export default new Experience(options)
