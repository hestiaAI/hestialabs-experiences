import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/bookbeat.png'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView: [genericDateViewer],
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'bookbeat',
  title: 'BookBeat'
}

export default new Experience(options)
