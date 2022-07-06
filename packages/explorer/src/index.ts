import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/clipboard-search-outline.png'
import { genericViewers as viewBlocks } from '@/pipelines/generic'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  keepOnlyFiles: false,
  subtitle: 'Explore data from anywhere!',
  title: 'Generic data experience',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
