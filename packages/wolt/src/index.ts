import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/wolt.png'
import { genericViewers as viewBlocks } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'wolt',
  title: 'Wolt',
  viewBlocks
}

export default new Experience(options)
