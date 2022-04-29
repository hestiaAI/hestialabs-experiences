import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/uber.png'
import viewBlocks from './blocks'

const options: ExperienceOptions = {
  dataPortal:
    'https://help.uber.com/ubereats/article/request-a-copy-of-your-uber-data',
  dataSamples: ['uber-trips.zip'],
  files: {
    trips: '**/Rider/trips_data.csv'
  },
  icon: icon,
  slug: 'uber',
  subtitle: 'Customer data',
  title: 'Uber',
  viewBlocks
}

export default new Experience(options)
