import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/google-takeout.png'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  dataPortal: 'https://takeout.google.com/settings/takeout',
  dataPortalMessage:
    '<strong>Important:</strong> For the experiment to work, please click on <strong>"deselect all"</strong> and then select the following:' +
    '<div><ul style="display: inline-block;"><li align="left"><strong>"Location History"</strong> and Change format from KML to <strong>JSON</strong>' +
    '<li><strong>"My Activity"</strong> and Change "Activity Records" format from HTML to <strong>JSON</strong></li></ul></div>' +
    'Once done you can click the blue "Next Step" button at the bottom of the page. This should queue your download',
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
