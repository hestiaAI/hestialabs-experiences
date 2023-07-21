import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from '@/collaborators/index'
import icon from '@/icons/tiktok.png'
import viewBlocks from './blocks'
import databaseConfig from './database'
import messages from './messages.json'
import dataSample from '@/data-samples/tiktok.zip'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  databaseConfig,
  dataPortal:
    'https://support.tiktok.com/en/account-and-privacy/personalized-ads-and-data/requesting-your-data',
  dataPortalMessage:
    '<strong>Important:</strong> To make the experiment work, please request your data in <strong>JSON</strong> format.',
  dataSamples: [dataSample],
  files: {
    userdata: '**/user_data.json'
  },
  hideFileExplorer: false,
  messages,
  icon,
  title: 'TikTok',
  viewBlocks
}

export default new Experience(options, options, packageJSON, import.meta.url)
