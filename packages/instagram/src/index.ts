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
    comments: '**/comments.json',
    connections: '**/connections.json',
    contacts: '**/contacts.json',
    likes: '**/likes.json',
    media: '**/media.json',
    messages: '**/messages.json',
    profile: '**/profile.json',
    saved: '**/saved.json',
    searches: '**/searches.json',
    settings: '**/settings.json'
  },
  icon: icon,
  slug: 'instagram',
  title: 'Instagram',
  viewBlocks
}

export default new Experience(options)
