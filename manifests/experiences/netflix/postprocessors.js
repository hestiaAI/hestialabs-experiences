const usagePerDay = result => {
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const results = []
  items.forEach(i => {
    const time = i.Duration.split(':')
    const minutes = +time[0] * 60 + +time[1] + +time[2] / 60
    results.push({
      date: new Date(i['Start Time']),
      duration: minutes,
      name: i['Profile Name']
    })
  })
  return { headers: ['date', 'duration', 'name'], items: results }
}

export default {
  usagePerDay
}
