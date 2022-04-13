const likesData = result => {
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const ret = []
  for (let i = 0; i < items.length; i++) {
    const record = items[i]
    // ret.push({ date: record.date, action: 'Passes', value: record.pass })
    ret.push({ date: record.date, action: 'Likes', value: record.likes })
  }
  return { headers: ['date', 'action', 'value'], items: ret }
}

export default { likesData }
