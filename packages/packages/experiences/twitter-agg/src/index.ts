import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from '@/collaborators/index'
import preprocessor from './preprocessor'
import icon from '@/icons/twitter.png'
import viewBlocks from './blocks'
import databaseConfig from './database'
import messages from './messages.json'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  databaseConfig,
  files: {
    ads: '**/block00.json',
    adsLastMonth: '**/block01.json',
    targeting: '**/block05.json',
    personalization: '**/personalization.js'
  },
  icon,
  messages,
  preprocessors: {
    '**/*.js': preprocessor
  },
  hideFileExplorer: false,
  title: 'Twitter Agg',
  viewBlocks
}

export default new Experience(options, options, packageJSON, import.meta.url)
