import { Experience, ExperienceOptions } from '../../index'
import preprocessor from 'preprocessors/twitter'
import icon from 'icons/twitter.png'

const filename = new URL(import.meta.url).pathname.split('/').slice(-3, -2)[0]

const options: ExperienceOptions = {
  dataSamples: ['twitter.zip', 'twitter-sample.zip'],
  fileExtensions: ['zip'],
  icon,
  preprocessor,
  // slug: 'twitter-advertisers',
  slug: filename,
  subtitle: 'Advertisers',
  title: 'Twitter',
  zipFilePaths: ['data/ad-impressions.js', 'data/ad-engagements.js']
}

export default new Experience(options)
