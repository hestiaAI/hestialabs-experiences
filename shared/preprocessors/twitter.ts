import { Preprocessor } from 'shared/types'

const twitter: Preprocessor = string =>
  // replace variable assignment in JS file from Twitter
  string.replace(/^[0-9a-zA-Z_.]+\s+=/, '')

export default twitter
