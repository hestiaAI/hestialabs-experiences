import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/bookbeat.png'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'bookbeat',
  title: 'BookBeat',
  viewBlocks: [genericDateViewer]
}

export default new Experience(options)
