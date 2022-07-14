import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/uber.png'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  dataPortal: 'https://myprivacy.uber.com/privacy/exploreyourdata/download',
  dataSamples: ['uber-driver-sample.zip'],
  files: {
    driver: '**/1 - Driver Detailed Device Data.csv',
    rider: '**/2 - Rider Detailed Device Data.csv',
    trips: '**/Trip*.csv'
  },
  icon: icon,
  title: 'Uber Driver',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
