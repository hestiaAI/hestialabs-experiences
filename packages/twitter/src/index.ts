import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from '@/collaborators/index'
import preprocessor from './preprocessor'
import icon from '@/icons/twitter.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  databaseConfig,
  dataPortal:
    'https://help.twitter.com/en/managing-your-account/how-to-download-your-twitter-archive',
  dataSamples: ['twitter.zip', 'twitter-sample.zip'],
  files: {
    impressions: '**/ad-impressions.js',
    engagements: '**/ad-engagements.js',
    personalization: '**/personalization.js'
  },
  icon: icon,
  preprocessors: {
    '**/*.js': preprocessor
  },
  title: 'Twitter',
  tutorialVideos: ['https://vimeo.com/691109800'],
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
