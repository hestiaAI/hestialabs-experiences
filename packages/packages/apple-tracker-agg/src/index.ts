import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import databaseConfig from './database'
import baseOptions from '../../apple-tracker/src/index'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  ...baseOptions.options,
  databaseConfig,
  dataSamples: [],
  files: {
    network: '**/block00.json',
    access: '**/block01.json'
  },
  subtitle: 'Tracking data',
  title: 'AppleTracker Agg',
  hideFileExplorer: false,
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
