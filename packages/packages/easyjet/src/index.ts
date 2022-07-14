import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/easyjet.png'
import { genericViewers } from '@/pipelines/generic'

const options: ExperienceOptions = {
  dataPortal:
    'https://www.easyjet.com/en/policy/privacy-promise/request-data-form',
  hideFileExplorer: false,
  icon: icon,
  title: 'EasyJet',
  viewBlocks: genericViewers
}

export default new Experience(options, packageJSON, import.meta.url)
