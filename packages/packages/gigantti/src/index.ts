import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/gigantti.jpg'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  title: 'Gigantti',
  viewBlocks: [genericDateViewer]
}

export default new Experience(options, packageJSON, import.meta.url)
