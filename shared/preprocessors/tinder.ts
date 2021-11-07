import { PreprocessorFunction } from 'shared/types'

const tinder: PreprocessorFunction = (string: string) => {
  const json = JSON.parse(string)
  Object.keys(json.Usage).forEach(key => {
    json.Usage[key] = Object.entries(json.Usage[key]).map(([date, value]) => ({
      date,
      value
    }))
  })
  return JSON.stringify(json)
}

export default tinder
