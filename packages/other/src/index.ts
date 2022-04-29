import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/help.png'

const options: ExperienceOptions = {
  icon: icon,
  slug: 'other',
  subtitle: 'Contact us for specific needs',
  title: 'More to come',
  url: 'mailto:contact@hestialabs.org',
  viewBlocks: []
}

export default new Experience(options)
