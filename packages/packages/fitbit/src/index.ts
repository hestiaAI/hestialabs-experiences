import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/fitbit.jpg'
import { genericViewers } from '@/pipelines/generic'

const options: ExperienceOptions = {
  dataPortal: 'https://help.fitbit.com/articles/en_US/Help_article/1133.htm',
  dataPortalMessage:
    '<strong>Important:</strong> To make the experiment work, please request your <strong>"Account Archive"</strong> not your <strong>"Fitbit Data"</strong>.',
  hideFileExplorer: false,
  icon: icon,
  title: 'Fitbit',
  viewBlocks: genericViewers
}

export default new Experience(options, packageJSON, import.meta.url)
