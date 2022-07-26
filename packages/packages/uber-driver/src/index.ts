import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/uber.png'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  dataPortal: 'https://myprivacy.uber.com/privacy/exploreyourdata/download',
  dataSamples: ['uber-driver-sample.zip'],
  files: {
    driver: '**/*Driver Detailed Device*.csv',
    rider: '**/*Rider Detailed Device*.csv',
    trips: '**/Trip*.csv'
  },
  icon: icon,
  title: 'Uber Driver',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
