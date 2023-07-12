import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/uber.png'
import viewBlocks from './blocks'
import messages from './messages.json'
import dataSample from '@/data-samples/uber.zip'

const options: ExperienceOptions = {
  dataPortal: 'https://myprivacy.uber.com/privacy/exploreyourdata/download',
  dataSamples: [dataSample],
  files: {
    trips: '**/Rider/trips_data.csv'
  },
  icon,
  messages,
  subtitle: 'Customer data',
  title: 'Uber Rider',
  viewBlocks
}

export default new Experience(options, undefined, packageJSON, import.meta.url)
