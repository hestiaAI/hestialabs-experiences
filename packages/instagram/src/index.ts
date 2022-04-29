import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/instagram.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  databaseConfig,
  dataPortal: 'https://help.instagram.com/196883487377501',
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
