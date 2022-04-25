import { PreprocessorFunction } from '@/types/experience-options'

const twitter: PreprocessorFunction = string =>
  // replace variable assignment in JS file from Twitter
  string.replace(/^[0-9a-zA-Z_.]+\s+=/, '')

export default twitter
