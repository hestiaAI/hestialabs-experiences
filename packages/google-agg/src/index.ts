import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/google-takeout.png'
import viewBlocks from './blocks'
import databaseConfig from './database'

const options: ExperienceOptions = {
  databaseConfig,
  dataPortal: 'https://takeout.google.com/settings/takeout',
  dataPortalMessage: '',
  files: {
    placeVisited: '**/block00.json',
    otherCandidate: '**/block01.json',
    travels: '**/block02.json',
    records: '**/block03.json',
    wifi: '**/block04.json',
    consent: '**/consent.json'
  },
  icon: icon,
  slug: 'google-agg',
  title: 'Google Agg',
  viewBlocks
}

export default new Experience(options)
