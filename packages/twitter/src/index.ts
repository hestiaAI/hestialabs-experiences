import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from '@/collaborators/index'
import preprocessor from './preprocessor'
import icon from '@/icons/twitter.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  databaseConfig,
  dataSamples: ['twitter.zip', 'twitter-sample.zip'],
  files: {
    impressions: '**/ad-impressions.js',
    engagements: '**/ad-engagements.js'
  },
  icon: icon,
  preprocessors: {
    '**/*.js': preprocessor
  },
  slug: 'twitter',
  title: 'Twitter',
  viewBlocks
}

export default new Experience(options)
