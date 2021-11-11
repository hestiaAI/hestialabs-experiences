async function googleMyActivity(fileManager) {
  const regex = /Takeout\/(.+?)\/(.+?)\/(.+?)\.json/
  const matchingFilenames = fileManager.getFilenames().filter(name => {
    console.log(name)
    return regex.test(name)
  })
  console.log(matchingFilenames)
  const files = await fileManager.preprocessFiles(matchingFilenames)
  const items = Object.entries(files).flatMap(([name, text]) => {
    try {
      return JSON.parse(text).map(obj => ({
        date: obj.time,
        event_source: obj.header,
        event_type: obj.title
      }))
    } catch (error) {
      return []
    }
  })
  console.log(items)
  const headers = ['date', 'event_source', 'event_type', 'event_value']
  return { items, headers }
}

export default {
  googleMyActivity
}
