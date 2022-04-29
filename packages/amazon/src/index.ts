import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/amazon.png'

const options: ExperienceOptions = {
  disabled: true,
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'amazon',
  title: 'Amazon',
  viewBlocks: []
}

export default new Experience(options)
