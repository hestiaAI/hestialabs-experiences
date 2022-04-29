import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/helsingin-sanomat.png'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'helsingin-sanomat',
  title: 'Helsingin Sanomat',
  viewBlocks: [genericDateViewer]
}

export default new Experience(options)
