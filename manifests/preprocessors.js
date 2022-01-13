const twitter = (filePath, content) => {
  // replace variable assignment in JS file from Twitter
  if (/\.js$/.test(filePath)) {
    return content.replace(/^[0-9a-zA-Z_.]+\s+=/, '')
  }
  return content
}

const tinder = (filePath, content) => {
  const json = JSON.parse(content)
  Object.keys(json?.Usage ?? {}).forEach(key => {
    json.Usage[key] = Object.keys(json.Usage[key]).map(date => ({
      date,
      value: json.Usage[key][date]
    }))
  })
  return JSON.stringify(json)
}

// https://stackoverflow.com/questions/17057407/javascript-create-a-string-or-char-from-an-utf-8-value
function convertHexToString(input) {
  // split input into groups of two
  const hex = input.match(/[\s\S]{2}/g) || []
  let output = ''
  // build a hex-encoded representation of your string
  for (let i = 0, j = hex.length; i < j; i++) {
    output += '%' + ('0' + hex[i]).slice(-2)
  }
  // decode it using this trick
  output = decodeURIComponent(output)
  return output
}

const facebook = (filePath, content) => {
  // Facebook gives us messed up files (https://stackoverflow.com/questions/52747566/what-encoding-facebook-uses-in-json-files-from-data-export)
  // For instance the "é" character is encoded in UTF-8 as 0xc3 0xa9
  // But they give it as \u00c3\u00a9
  // To make it worse, unicode characters may have 2, 3, or 4 bytes
  const r = '\\\\u00([0-9a-f]{2})'
  // Successively try to replace characters with 2, 3, and 4 bytes
  // Can't use a loop because the number of arguments is variable
  content = content.replace(new RegExp(r + r, 'g'), (match, p1, p2) => {
    try {
      return convertHexToString(p1 + p2)
    } catch {}
    return match
  })
  content = content.replace(new RegExp(r + r + r, 'g'), (match, p1, p2, p3) => {
    try {
      return convertHexToString(p1 + p2 + p3)
    } catch {}
    return match
  })
  content = content.replace(
    new RegExp(r + r + r + r, 'g'),
    (match, p1, p2, p3, p4) => {
      try {
        return convertHexToString(p1 + p2 + p3 + p4)
      } catch {}
      return match
    }
  )

  // In your_topics/your_topics.json, we have to replace the list of strings
  // by a list of objects, otherwise yarrrml is unable to get the values.
  if (/your_topics\/your_topics\.json$/.test(filePath)) {
    try {
      const json = JSON.parse(content)
      const topics = json.inferred_topics_v2.map(topic => {
        return { topic }
      })
      json.inferred_topics_v2 = topics
      return JSON.stringify(json)
    } catch {}
  }
  // Same for ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json
  if (
    /ads_information\/advertisers_who_uploaded_a_contact_list_with_your_information\.json$/.test(
      filePath
    )
  ) {
    try {
      const json = JSON.parse(content)
      const advertisers = json.custom_audiences_v2.map(advertiser => {
        return { advertiser }
      })
      json.custom_audiences_v2 = advertisers
      return JSON.stringify(json)
    } catch {}
  }

  return content
}

export default {
  twitter,
  tinder,
  facebook
}
