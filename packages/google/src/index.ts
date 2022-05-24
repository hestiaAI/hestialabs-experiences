import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/google-takeout.png'
import preprocessor from './preprocessor'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  databaseConfig,
  dataPortal: 'https://takeout.google.com/settings/takeout',
  dataPortalMessage:
    '<strong>Important:</strong> For the experiment to work, please click on <strong>"deselect all"</strong> and then select the following:' +
    '<div><ul style="display: inline-block;"><li align="left"><strong>"Location History"</strong> and Change format from KML to <strong>JSON</strong>' +
    '<li><strong>"My Activity"</strong> and Change "Activity Records" format from HTML to <strong>JSON</strong></li></ul></div>' +
    'Once done you can click the blue "Next Step" button at the bottom of the page. This should queue your download',
  files: {
    $DYNAMIC_FILES: '*/*.html'
  },
  dataSamples: ['takeout.zip'],
  icon: icon,
  keepOnlyFiles: false,
  preprocessors: {
    '*/*.html': preprocessor
  },
  slug: 'google',
  title: 'Google Takeout',
  viewBlocks
}

export default new Experience(options)
