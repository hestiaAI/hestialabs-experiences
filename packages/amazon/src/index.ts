import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/amazon.png'

const options: ExperienceOptions = {
  defaultView: [],
  disabled: true,
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'amazon',
  title: 'Amazon'
}

export default new Experience(options)
