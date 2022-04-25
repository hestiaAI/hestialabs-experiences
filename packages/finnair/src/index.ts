import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/finnair.jpg'
import { genericViewers as defaultView } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView,
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'finnair',
  title: 'FinnAir'
}

export default new Experience(options)
