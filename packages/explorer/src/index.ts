import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/clipboard-search-outline.png'
import { genericViewers as defaultView } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView,
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'explorer',
  subtitle: 'Explore data from anywhere!',
  title: 'Generic data experience'
}

export default new Experience(options)
