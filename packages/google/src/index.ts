import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/google-takeout.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  databaseConfig,
  dataPortal: 'https://takeout.google.com/settings/takeout',
  dataPortalMessage:
    '<strong>Important:</strong> For the experiment to work, please click on <strong>"deselect all"</strong> and then select the following: <strong>"Location History"</strong><div>' +
    'Once done you can click the blue "Next Step" button at the bottom of the page. This should queue your download',
  files: {
    LOCATION_HISTORY: '**/*.json'
  },
  dataSamples: ['takeout.zip'],
  icon: icon,
  keepOnlyFiles: true,
  slug: 'google',
  title: 'Google Takeout',
  viewBlocks
}

export default new Experience(options)
