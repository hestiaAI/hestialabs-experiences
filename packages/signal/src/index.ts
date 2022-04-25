import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/signal.svg'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView: [genericDateViewer],
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'signal',
  title: 'Signal'
}

export default new Experience(options)
