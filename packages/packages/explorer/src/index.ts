import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/clipboard-search-outline.png'
import { genericViewers as viewBlocks } from '@/pipelines/generic'
import viewBlockMessagesJson from '@/pipelines/generic-messages.json'
import messagesJson from './messages.json'

// There must be a better way to declare types...
const viewBlockMessages: any = viewBlockMessagesJson
const messages: any = messagesJson

// merge explorer messages with generic block messages
Object.keys(viewBlockMessages).forEach(lang => {
  const vbLangMess = viewBlockMessages[lang]
  const viewBlocks = messages[lang].viewBlocks || {}
  messages[lang].viewBlocks = viewBlocks
  Object.keys(vbLangMess).forEach(viewBlockId => {
    viewBlocks[viewBlockId] = vbLangMess[viewBlockId]
  })
})
const options: ExperienceOptions = {
  hideSummary: false,
  hideFileExplorer: false,
  icon: icon,
  messages,
  keepOnlyFiles: false,
  subtitle: 'Explore data from anywhere!',
  title: 'Generic data experience',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
