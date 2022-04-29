import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/tracker-control.png'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  dataSamples: ['tracker-control.csv'],
  files: {
    'tracker-control': '**/*.csv'
  },
  icon: icon,
  slug: 'tracker-control',
  subtitle: 'Tracking data',
  title: 'TrackerControl',
  viewBlocks
}

export default new Experience(options)
