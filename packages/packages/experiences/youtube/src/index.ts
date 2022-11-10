import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/youtube.png'

const options: ExperienceOptions = {
  disabled: true,
  hideFileExplorer: false,
  hideSummary: false,
  icon,
  title: 'YouTube',
  viewBlocks: []
}

export default new Experience(options, packageJSON, import.meta.url)
