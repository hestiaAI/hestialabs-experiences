// Functions defined in this module should expect an object containing the input filenames and their content
// They should return a single string

const trackerControl = inputFiles => {
  return Object.values(inputFiles)[0]
}

const twitterDashboard = inputFiles => {
  throw new Error('not implemented')
}

export default {
  trackerControl,
  twitterDashboard
}
