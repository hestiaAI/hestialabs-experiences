import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/netflix.png'
import defaultView from './blocks'

const options: ExperienceOptions = {
  defaultView,
  files: {
    'viewing-activity': '**/CONTENT_INTERACTION/ViewingActivity.csv',
    'messages-by-netflix': '**/MESSAGES/MessagesSentByNetflix.csv'
  },
  icon: icon,
  slug: 'netflix',
  title: 'Netflix'
}

export default new Experience(options)
