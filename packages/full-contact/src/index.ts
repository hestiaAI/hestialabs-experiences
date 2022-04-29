import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/full-contact.png'
import { genericViewers as viewBlocks } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'full-contact',
  title: 'Full Contact',
  viewBlocks
}

export default new Experience(options)
