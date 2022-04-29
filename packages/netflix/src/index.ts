import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/netflix.png'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  files: {
    'viewing-activity': '**/CONTENT_INTERACTION/ViewingActivity.csv',
    'messages-by-netflix': '**/MESSAGES/MessagesSentByNetflix.csv'
  },
  icon: icon,
  slug: 'netflix',
  title: 'Netflix',
  viewBlocks
}

export default new Experience(options)
