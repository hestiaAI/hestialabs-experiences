import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/netflix.png'
import viewBlocks from './blocks'
import messages from './messages.json'
import dataSample from '@/data-samples/netflix.zip'

const options: ExperienceOptions = {
  dataSamples: [dataSample],
  files: {
    'viewing-activity': '**/CONTENT_INTERACTION/ViewingActivity.csv',
    'messages-by-netflix': '**/MESSAGES/MessagesSentByNetflix.csv'
  },
  icon,
  messages,
  title: 'Netflix',
  viewBlocks
}

export default new Experience(options, options, packageJSON, import.meta.url)
