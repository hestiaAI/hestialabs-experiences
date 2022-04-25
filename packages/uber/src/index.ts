import { Experience, ExperienceOptions } from '@/index'
import icon from '@/icons/uber.png'
import defaultView from './blocks'

const options: ExperienceOptions = {
  dataPortal:
    'https://help.uber.com/ubereats/article/request-a-copy-of-your-uber-data',
  dataSamples: ['uber-trips.zip'],
  defaultView,
  files: {
    trips: '**/Rider/trips_data.csv'
  },
  icon: icon,
  slug: 'uber',
  subtitle: 'Customer data',
  title: 'Uber'
}

export default new Experience(options)
