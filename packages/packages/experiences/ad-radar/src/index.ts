import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/eyeballs.jpg'

const options: ExperienceOptions = {
  disabled: true,
  icon,
  subtitle: 'Browser extension',
  title: 'Ad Radar',
  url: 'https://github.com/hestiaAI/ad-radar',
  viewBlocks: []
}

export default new Experience(options, options, packageJSON, import.meta.url)
