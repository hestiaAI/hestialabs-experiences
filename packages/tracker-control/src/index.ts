import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/tracker-control.png'
import defaultView from './blocks'

const options: ExperienceOptions = {
  defaultView,
  files: {
    'tracker-control': '**/*.csv'
  },
  icon: icon,
  slug: 'tracker-control',
  subtitle: 'Tracking data',
  title: 'TrackerControl'
}

export default new Experience(options)
