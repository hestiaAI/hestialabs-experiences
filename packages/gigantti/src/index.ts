import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/gigantti.jpg'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'gigantti',
  title: 'Gigantti',
  viewBlocks: [genericDateViewer]
}

export default new Experience(options)
