const twitter = string => {
  // replace variable assignment in JS file from Twitter
  return string.replace(/^[0-9a-zA-Z_.]+\s+=/, '')
}

export default {
  twitter
}
