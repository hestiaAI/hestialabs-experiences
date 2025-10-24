import { PreprocessorFunction } from '@/types/experience-options'

const ndjsonToJson: PreprocessorFunction = string => {
  const commatize = string.replace(/\n/g, ',')
  const trim = commatize.replace(/(^,)|(,$)/g, '')
  return `[${trim}]`
}

export default ndjsonToJson
