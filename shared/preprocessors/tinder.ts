import { Preprocessor } from 'shared/types'

const tinder: Preprocessor = (string: string) => {
  const json = JSON.parse(string)
  Object.keys(json?.Usage ?? {}).forEach(key => {
    json.Usage[key] = Object.keys(json.Usage[key]).map(date => ({
      date,
      value: json.Usage[key][date]
    }))
  })
  return JSON.stringify(json)
}

export default tinder
