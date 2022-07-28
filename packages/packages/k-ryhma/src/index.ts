import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/k-ryhma.png'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  title: 'K-Ryhmä',
  viewBlocks: [genericDateViewer]
}

export default new Experience(options, packageJSON, import.meta.url)
