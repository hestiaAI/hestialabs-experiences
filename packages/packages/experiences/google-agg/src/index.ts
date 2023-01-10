import packageJSON from '../package.json'
import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/google-takeout.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  databaseConfig,
  hideFileExplorer: false,
  files: {
    placeVisited: '**/block00.json',
    otherCandidate: '**/block02.json',
    travels: '**/block03.json',
    records: '**/block04.json',
    wifi: '**/block05.json',
    consent: '**/consent.json'
  },
  icon,
  title: 'Google Agg',
  viewBlocks
}

export default new Experience(options, packageJSON, import.meta.url)
