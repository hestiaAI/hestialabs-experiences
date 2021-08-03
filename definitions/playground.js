const preprocessor = string => {
  // replace variable assignment in JS file from Twitter
  // so there is no need to do it manually
  return string.replace(/^[0-9a-zA-Z_.]+\s+=/, '')
}

export default {
  ext: 'json,js,csv,xml',
  multiple: true,
  preprocessor
}
