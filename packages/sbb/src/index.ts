import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/sbb.png'
import { genericViewers as defaultView } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView,
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'sbb',
  title: 'SBB/CFF'
}

export default new Experience(options)
