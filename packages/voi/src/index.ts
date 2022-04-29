import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/voi.jpg'
import { genericViewers as viewBlocks } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'voi',
  title: 'Voi',
  viewBlocks
}

export default new Experience(options)
