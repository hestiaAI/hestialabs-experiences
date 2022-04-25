import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/eyeballs.jpg'

const options: ExperienceOptions = {
  defaultView: [],
  disabled: true,
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'ad-radar',
  subtitle: 'Browser extension',
  title: 'Ad Radar',
  url: 'https://github.com/hestiaAI/ad-radar'
}

export default new Experience(options)
