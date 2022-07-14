import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/amazon.png'

const options: ExperienceOptions = {
  disabled: true,
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  title: 'Amazon',
  viewBlocks: []
}

export default new Experience(options, packageJSON, import.meta.url)
