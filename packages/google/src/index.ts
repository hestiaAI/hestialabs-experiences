import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/google-takeout.png'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  dataPortal: 'https://takeout.google.com/settings/takeout',
  files: {
    'my-activity':
      '**/*/+(MyActivity|My Activity|MonActivité|Mon Activité|OmatTapahtumat|Omat Tapahtumat).json'
  },
  icon: icon,
  slug: 'google',
  title: 'Google Takeout',
  viewBlocks
}

export default new Experience(options)
