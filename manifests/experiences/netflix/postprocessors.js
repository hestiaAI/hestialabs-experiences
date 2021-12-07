const notifsPerDay = result => {
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const results = []
  // get unique users
  const users = items
    .map(i => i['Profile Name'])
    .filter((value, index, self) => self.indexOf(value) === index)

  // Pivot data
  items.forEach(i => {
    const row = {
      date: new Date(i['Sent Utc Ts'])
    }
    users.forEach(u => {
      if (i['Profile Name'] === u) row[u] = 1
      else row[u] = 0
    })

    results.push(row)
  })
  // sort by date
  results.sort((e1, e2) => e1.date - e2.date)
  return { headers: ['date', users].flat(), items: results }
}
export default {
  notifsPerDay
}
