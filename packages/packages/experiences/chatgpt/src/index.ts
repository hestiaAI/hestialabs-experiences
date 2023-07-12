import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/chatgpt.png'
import viewBlocks from './blocks'
import messages from './messages.json'
import databaseConfig from './database'

const options: ExperienceOptions = {
  databaseConfig,
  files: {
    conversations: '**/conversations.json'
  },
  hideFileExplorer: false,
  messages,
  keepOnlyFiles: false,
  icon,
  title: 'ChatGPT',
  viewBlocks
}

export default new Experience(options, options, packageJSON, import.meta.url)
