import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/google-takeout.png'
import viewBlocks from './blocks'
import databaseConfig from './database'
import messages from './messages.json'
import dataSample from '@/data-samples/google-takeout.zip'

const options: ExperienceOptions = {
  databaseConfig,
  dataPortal: 'https://takeout.google.com/settings/takeout',
  files: {
    LOCATION_HISTORY: '**/*.json'
  },
  dataSamples: [dataSample],
  icon,
  keepOnlyFiles: true,
  messages,
  title: 'Google Takeout',
  viewBlocks
}

export default new Experience(options, options, packageJSON, import.meta.url)
