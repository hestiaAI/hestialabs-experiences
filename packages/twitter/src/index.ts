import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from '@/collaborators/index'
import preprocessor from './preprocessor'
import icon from '@/icons/twitter.png'
import defaultView from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  databaseConfig,
  dataSamples: ['twitter.zip', 'twitter-sample.zip'],
  defaultView,
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
