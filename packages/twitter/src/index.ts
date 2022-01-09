import { Experience, ExperienceOptions } from 'shared/index'
import { theEyeballs } from 'collaborators/index'
import preprocessor from 'preprocessors/twitter'
import icon from 'icons/twitter.png'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  dataSamples: ['twitter.zip', 'twitter-sample.zip'],
  defaultView: [],
  icon: icon,
  preprocessor,
  slug: 'twitter',
  title: 'Twitter',
  zipFilePaths: ['data/ad-impressions.js', 'data/ad-engagements.js']
}

export default new Experience(options)
