import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from '@/collaborators/index'
import preprocessor from '@/preprocessors/twitter'
import icon from '@/icons/twitter.png'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  dataSamples: ['twitter.zip', 'twitter-sample.zip'],
  defaultView: [],
  files: {
    impressions: '**/ad-impressions.js',
    engagements: '**/ad-engagements.js'
  },
  icon: icon,
  preprocessors: {
    '**/*.js': preprocessor
  },
  slug: 'twitter',
  title: 'Twitter'
}

export default new Experience(options)
