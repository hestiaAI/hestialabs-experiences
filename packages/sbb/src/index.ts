import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/sbb.png'
import { genericViewers as viewBlocks } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'sbb',
  title: 'SBB/CFF',
  viewBlocks
}

export default new Experience(options)
