import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/lime.jpg'
import { genericViewers as defaultView } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView,
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'lime',
  title: 'Lime'
}

export default new Experience(options)
