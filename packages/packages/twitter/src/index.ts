import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from '@/collaborators/index'
import preprocessor from './preprocessor'
import icon from '@/icons/twitter.png'
import viewBlocks from './blocks'
import databaseConfig from './database'
import dataModel from './model/model.json'
import messages from './messages.json'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  databaseConfig,
  dataModel,
  dataPortal:
    'https://help.twitter.com/en/managing-your-account/how-to-download-your-twitter-archive',
  dataSamples: ['twitter.zip', 'twitter-sample.zip'],
  files: {
    impressions: '**/ad-impressions.js',
    engagements: '**/ad-engagements.js',
    personalization: '**/personalization.js'
  },
  icon: icon,
  messages,
  preprocessors: {
    '**/*.js': preprocessor
  },
  hideFileExplorer: false,
  title: 'Twitter',
  tutorialVideos: ['https://vimeo.com/691109800'],
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
