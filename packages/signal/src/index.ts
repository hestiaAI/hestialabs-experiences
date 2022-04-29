import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/signal.svg'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'signal',
  title: 'Signal',
  viewBlocks: [genericDateViewer]
}

export default new Experience(options)
