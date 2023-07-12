import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/clipboard-search-outline.png'
import { genericViewers as viewBlocks } from '@/pipelines/generic'
import messages from './messages.json'

const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon,
  messages,
  keepOnlyFiles: false,
  subtitle: 'Explore data from anywhere!',
  title: 'Generic data experience',
  viewBlocks
}

export default new Experience(options, undefined, packageJSON, import.meta.url)
