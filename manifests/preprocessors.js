const twitter = string => {
  // replace variable assignment in JS file from Twitter
  return string.replace(/^[0-9a-zA-Z_.]+\s+=/, '')
}

const tinder = string => {
  const json = JSON.parse(string)
  Object.keys(json.Usage).forEach(function (key, _) {
    const dates = []
    Object.keys(json.Usage[key]).forEach(function (date, _) {
      dates.push({
        date,
        value: json.Usage[key][date]
      })
    })
    json.Usage[key] = dates
  })
  return JSON.stringify(json)
}

export default {
  twitter,
  tinder
}
