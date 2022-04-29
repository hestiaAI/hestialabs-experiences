import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/demdex.jpg'
import { genericViewers as viewBlocks } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'demdex',
  title: 'Demdex',
  viewBlocks
}

export default new Experience(options)
