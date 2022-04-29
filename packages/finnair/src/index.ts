import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/finnair.jpg'
import { genericViewers as viewBlocks } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'finnair',
  title: 'FinnAir',
  viewBlocks
}

export default new Experience(options)
