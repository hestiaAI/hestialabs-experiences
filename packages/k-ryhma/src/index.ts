import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/k-ryhma.png'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView: [genericDateViewer],
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'k-ryhma',
  title: 'K-Ryhmä'
}

export default new Experience(options)
