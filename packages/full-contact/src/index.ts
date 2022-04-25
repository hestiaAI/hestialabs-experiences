import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/full-contact.png'
import { genericViewers as defaultView } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView,
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'full-contact',
  title: 'Full Contact'
}

export default new Experience(options)
