import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/netflix.png'
import viewBlocks from './blocks'
import messages from './messages.json'

const options: ExperienceOptions = {
  files: {
    'viewing-activity': '**/CONTENT_INTERACTION/ViewingActivity.csv',
    'messages-by-netflix': '**/MESSAGES/MessagesSentByNetflix.csv'
  },
  icon,
  messages,
  title: 'Netflix',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
