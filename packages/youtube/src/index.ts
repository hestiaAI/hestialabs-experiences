import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/youtube.png'

const options: ExperienceOptions = {
  disabled: true,
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'youtube',
  title: 'YouTube',
  viewBlocks: []
}

export default new Experience(options)
