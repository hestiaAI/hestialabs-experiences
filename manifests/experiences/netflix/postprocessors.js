const usagePerDay = result => {
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const results = []
  // get unique users
  const users = items
    .map(i => i['Profile Name'])
    .filter((value, index, self) => self.indexOf(value) === index)
  items.forEach(i => {
    const time = i.Duration.split(':')
    const hours = +time[0] + +time[1] / 60 + +time[2] / 60 / 60
    const row = {
      date: new Date(i['Start Time'])
    }
    users.forEach(u => {
      if (i['Profile Name'] === u) row[u] = hours
      else row[u] = 0
    })

    results.push(row)
  })
  results.sort((e1, e2) => e1.date - e2.date)
  return { headers: ['date', users].flat(), items: results }
}
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
  usagePerDay,
  notifsPerDay
}
