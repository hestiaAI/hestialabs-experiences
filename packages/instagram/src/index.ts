import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/instagram.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  databaseConfig,
  dataPortal: 'https://help.instagram.com/181231772500920',
  dataPortalMessage:
    '<strong>Important:</strong> To make the experiment work, please request your data in <strong>JSON</strong> format.',
  dataSamples: ['test-instagram.zip'],
  files: {
    messages: '**/messages/inbox/**/message_*.json',
    followers: '**/followers.json',
    followings: '**/following.json'
  },
  hideFileExplorer: true,
  icon: icon,
  slug: 'instagram',
  title: 'Instagram',
  viewBlocks
}

export default new Experience(options)
