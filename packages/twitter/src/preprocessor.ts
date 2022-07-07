import { PreprocessorFunction } from '@/types/experience-options'

const twitter: PreprocessorFunction = string =>
  // replace variable assignment in JS file from Twitter + pretty json string
  JSON.stringify(JSON.parse(string.replace(/^[0-9a-zA-Z_.]+\s+=/, '')), null, 2)

export default twitter
