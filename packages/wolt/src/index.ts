import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/wolt.png'
import { genericViewers as defaultView } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView,
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'wolt',
  title: 'Wolt'
}

export default new Experience(options)
