// Tinder

import { JSONPath } from 'jsonpath-plus'
import { DB } from '~/utils/sql'

export default async function databaseBuilder(fileManager) {
  const db = new DB()
  await db.init()

  // There should be only one json file in a tinder export
  const TinderFile = JSON.parse(
    (await fileManager.getPreprocessedTextFromId('tinder'))[0] ?? null
  )

  /// Likes ////////////////////
  db.create('Tinder', [
    ['action', 'TEXT'],
    ['date', 'TEXT'],
    ['amount', 'INTEGER']
  ])
  const likesJSON =
    JSONPath({
      path: '$.Usage.swipes_likes[*]',
      json: TinderFile
    }) ?? []
  const likesItems = []
  likesJSON.forEach((v, i) => {
    likesItems.push({
      action: 'swipe_like',
      date: v.date,
      amount: v.value
    })
  })
  db.insert('Tinder', likesItems)

  /// Dislikes ////////////////////
  const passesJSON = JSONPath({
    path: '$.Usage.swipes_passes[*]',
    json: TinderFile
  })
  const passesItems = []
  passesJSON.forEach((v, i) => {
    passesItems.push({
      action: 'swipe_pass',
      date: v.date,
      amount: v.value
    })
  })
  db.insert('Tinder', passesItems)

  /// Superlikes ////////////////////
  const superlikesJSON = JSONPath({
    path: '$.Usage.superlikes[*]',
    json: TinderFile
  })
  const superlikesItems = []
  superlikesJSON.forEach((v, i) => {
    superlikesItems.push({
      action: 'superlikes',
      date: v.date,
      amount: v.value
    })
  })
  db.insert('Tinder', superlikesItems)

  /// App open ////////////////////
  const appOpenJSON = JSONPath({
    path: '$.Usage.app_opens[*]',
    json: TinderFile
  })
  const appOpenItems = []
  appOpenJSON.forEach((v, i) => {
    appOpenItems.push({
      action: 'app_open',
      date: v.date,
      amount: v.value
    })
  })
  db.insert('Tinder', appOpenItems)

  /// messages recieved ////////////////////
  const messagesReceivedJSON = JSONPath({
    path: '$.Usage.messages_received[*]',
    json: TinderFile
  })
  const messagesReceivedItems = []
  messagesReceivedJSON.forEach((v, i) => {
    messagesReceivedItems.push({
      action: 'messages_received',
      date: v.date,
      amount: v.value
    })
  })
  db.insert('Tinder', messagesReceivedItems)

  /// messages sent ////////////////////
  const messagesSentJSON = JSONPath({
    path: '$.Usage.messages_sent[*]',
    json: TinderFile
  })
  const messagesSentItems = []
  messagesSentJSON.forEach((v, i) => {
    messagesSentItems.push({
      action: 'messages_sent',
      date: v.date,
      amount: v.value
    })
  })
  db.insert('Tinder', messagesSentItems)

  /// matches ////////////////////
  const matchesJSON = JSONPath({
    path: '$.Usage.matches[*]',
    json: TinderFile
  })
  const matchesItems = []
  matchesJSON.forEach((v, i) => {
    matchesItems.push({
      action: 'matches',
      date: v.date,
      amount: v.value
    })
  })
  db.insert('Tinder', matchesItems)

  return db
}
