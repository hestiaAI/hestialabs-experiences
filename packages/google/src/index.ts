import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/google-takeout.png'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  dataPortal: 'https://takeout.google.com/settings/takeout',
  dataPortalMessage:
    '<strong>Important:</strong> For the experiment to work, please click on <strong>"deselect all"</strong> and then select <strong>"Location History"</strong> and <strong>"My Activity"</strong>. For the latter click on the button at the bottom left to select the <strong>JSON</strong> format.',
  files: {
    'my-activity':
      '**/*/+(MyActivity|My Activity|MonActivité|Mon Activité|OmatTapahtumat|Omat Tapahtumat).json'
  },
  icon: icon,
  keepOnlyFiles: false,
  slug: 'google',
  title: 'Google Takeout',
  viewBlocks
}

export default new Experience(options)
