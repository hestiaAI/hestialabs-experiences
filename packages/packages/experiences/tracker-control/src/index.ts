import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/tracker-control.png'
import viewBlocks from './blocks'
import messages from './messages.json'
import dataSample from '@/data-samples/tracker-control.csv'

const options: ExperienceOptions = {
  dataPortalHtml:
    'Install and enable TrackerControl to monitor the behaviour of the apps on your Android phone, using ' +
    '<a href="https://github.com/hestiaAI/data-catalog/blob/main/workshop/install-and-enable-trackercontrol.md" target="_blank" rel="noreferrer noopener" >these install instructions</a>. ' +
    'Once you have collected some data, export it (<a href="https://github.com/hestiaAI/data-catalog/blob/main/workshop/how-to-export-data-from-trackercontrol.md" target="_blank" rel="noreferrer noopener" >export instructions here</a>)' +
    ' and analyze it here.',
  dataSamples: [dataSample],
  files: {
    'tracker-control': '**/*.csv'
  },
  icon,
  messages,
  subtitle: 'Tracking data',
  title: 'TrackerControl',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
