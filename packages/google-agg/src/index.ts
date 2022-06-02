import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/google-takeout.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  databaseConfig,
  dataPortal: 'https://takeout.google.com/settings/takeout',
  dataPortalMessage: '',
  files: {
    placeVisited: '*/block01.json'
  },
  icon: icon,
  keepOnlyFiles: true,
  slug: 'google-agg',
  title: 'Google Agg',
  viewBlocks
}

export default new Experience(options)
