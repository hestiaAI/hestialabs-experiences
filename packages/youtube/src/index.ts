import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/youtube.png'

const options: ExperienceOptions = {
  defaultView: [],
  disabled: true,
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'youtube',
  title: 'YouTube'
}

export default new Experience(options)
