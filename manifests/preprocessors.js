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

const facebook = string => {
  // In your_topics/your_topics.json, we have to replace the list of strings
  // by a list of objects, otherwise yarrrml is unable to get the values.
  const json = JSON.parse(string)
  if (Object.keys(json).includes('inferred_topics_v2')) {
    const topics = json.inferred_topics_v2.map(topic => {
      return { topic }
    })
    json.inferred_topics_v2 = topics
  } else if (Object.keys(json).includes('custom_audiences_v2')) {
    // Same for ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json
    const advertisers = json.custom_audiences_v2.map(advertiser => {
      return { advertiser }
    })
    json.custom_audiences_v2 = advertisers
  }
  return JSON.stringify(json)
}

export default {
  twitter,
  tinder,
  facebook
}
