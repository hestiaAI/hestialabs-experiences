import getCsvHeadersAndItems from '~/utils/csv'

async function trackerControl(inputFiles) {
  const data = Object.values(inputFiles)[0]
  return await getCsvHeadersAndItems(data)
}

export default {
  trackerControl
}
