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
  slug: 'apple-tracker-agg',
  subtitle: 'Tracking data',
  title: 'AppleTracker Agg',
  viewBlocks
}

export default new Experience(options)
