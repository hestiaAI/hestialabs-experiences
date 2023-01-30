import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/tracker-control.png'
import viewBlocks from './blocks'
import databaseConfig from './database'
import messages from '../../tracker-control/src/messages.json'

const options: ExperienceOptions = {
  databaseConfig,
  files: {
    'tracker-control': '**/block00.json'
  },
  hideFileExplorer: false,
  icon,
  messages,
  subtitle: 'Tracking data',
  title: 'TrackerControl Agg',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
