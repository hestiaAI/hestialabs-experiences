import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/uber.png'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  dataPortal: 'https://myprivacy.uber.com/privacy/exploreyourdata/download',
  dataSamples: ['uber-trips.zip'],
  files: {
    trips: '**/Rider/trips_data.csv'
  },
  icon: icon,
  subtitle: 'Customer data',
  title: 'Uber',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
