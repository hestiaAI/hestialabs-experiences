import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/hsl.png'
import { genericViewers as viewBlocks } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  slug: 'hsl',
  title: 'HSL',
  viewBlocks
}

export default new Experience(options)
