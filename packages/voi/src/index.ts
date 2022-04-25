import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/voi.jpg'
import { genericViewers as defaultView } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView,
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'voi',
  title: 'Voi'
}

export default new Experience(options)
