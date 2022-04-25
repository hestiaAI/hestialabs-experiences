import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/apple.png'
import { genericViewers as defaultView } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView,
  disabled: true,
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'apple',
  title: 'Apple'
}

export default new Experience(options)
