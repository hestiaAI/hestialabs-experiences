import { Experience, ExperienceOptions } from '@/index'
import { theEyeballs } from '@/collaborators/index'
import icon from '@/icons/tiktok.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  collaborator: theEyeballs,
  databaseConfig,
  dataPortal:
    'https://support.tiktok.com/en/account-and-privacy/personalized-ads-and-data/requesting-your-data',
  files: {
    userdata: '**/user_data.json'
  },
  icon: icon,
  slug: 'tiktok',
  title: 'TikTok',
  viewBlocks
}

export default new Experience(options)
