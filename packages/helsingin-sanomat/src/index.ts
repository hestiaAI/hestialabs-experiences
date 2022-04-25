import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/helsingin-sanomat.png'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView: [genericDateViewer],
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'helsingin-sanomat',
  title: 'Helsingin Sanomat'
}

export default new Experience(options)
