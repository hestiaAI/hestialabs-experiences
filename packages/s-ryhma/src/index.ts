import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/s-ryhma.png'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 's-ryhma',
  title: 'S-Ryhmä',
  viewBlocks: [genericDateViewer]
}

export default new Experience(options)
