const likesDislikesData = result => {
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const ret = []
  for (let i = 0; i < items.length; i++) {
    const record = items[i]
    ret.push({ date: record.date, action: 'Passes', value: record.pass })
    ret.push({ date: record.date, action: 'Likes', value: record.likes })
  }
  return { headers: ['date', 'action', 'value'], items: ret }
}

const appOpensData = result => {
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const ret = []
  for (let i = 0; i < items.length; i++) {
    const record = items[i]
    ret.push({ date: record.date, action: 'App opened', value: record.open })
  }
  return { headers: ['date', 'action', 'value'], items: ret }
}

const likesDislikesMessagesData = result => {
  const items = result?.items || []
  if (items.length === 0) {
    return { headers: [], items: [] }
  }
  const ret = []
  for (let i = 0; i < items.length; i++) {
    const record = items[i]
    ret.push({ date: record.date, action: 'Passes', value: record.pass })
    ret.push({ date: record.date, action: 'Likes', value: record.likes })
    ret.push({
      date: record.date,
      action: 'Messages received',
      value: record.msg_rcv
    })
    ret.push({
      date: record.date,
      action: 'Messages sent',
      value: record.msg_sent
    })
  }
  return { headers: ['date', 'action', 'value'], items: ret }
}

export default { likesDislikesData, appOpensData, likesDislikesMessagesData }
