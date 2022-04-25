import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/google-takeout.png'
import defaultView from './blocks'

const options: ExperienceOptions = {
  dataPortal: 'https://takeout.google.com/settings/takeout',
  defaultView,
  files: {
    'my-activity':
      '**/*/+(MyActivity|My Activity|MonActivité|Mon Activité|OmatTapahtumat|Omat Tapahtumat).json'
  },
  icon: icon,
  slug: 'google',
  title: 'Google Takeout'
}

export default new Experience(options)
