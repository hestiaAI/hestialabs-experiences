import { twitterPreprocessor as preprocessor } from './preprocessors'

const files = ['data/ad-impressions.js', 'data/ad-engagements.js']

export default {
  ext: 'zip',
  files,
  preprocessor
}
