async function trackerControl({ fileManager }) {
  return await fileManager.getCsvItems('input.csv')
}

export default {
  trackerControl
}
