import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/whatsapp.png'
import { genericDateViewer } from '@/pipelines/generic'

const options: ExperienceOptions = {
  disabled: true,
  hideFileExplorer: false,
  hideSummary: false,
  icon: icon,
  slug: 'whatsapp',
  title: 'WhatsApp',
  viewBlocks: [genericDateViewer]
}

export default new Experience(options)
