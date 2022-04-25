import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/gigantti.jpg'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  defaultView: [genericDateViewer],
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'gigantti',
  title: 'Gigantti'
}

export default new Experience(options)
