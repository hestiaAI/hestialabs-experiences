import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/eyeballs.jpg'

const options: ExperienceOptions = {
  disabled: true,
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  subtitle: 'Browser extension',
  title: 'Ad Radar',
  url: 'https://github.com/hestiaAI/ad-radar',
  viewBlocks: []
}

export default new Experience(options, packageJSON, import.meta.url)
