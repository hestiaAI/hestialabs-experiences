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

  /// User Infos ////////////////////
  db.create('UserInfos', [
    ['ageFilterMax', 'INTEGER'],
    ['ageFilterMin', 'INTEGER'],
    ['birthDate', 'TEXT'],
    ['createDate', 'TEXT'],
    ['gender', 'TEXT'],
    ['genderFilter', 'TEXT'],
    ['interestedIn', 'TEXT'],
    ['education', 'TEXT'],
    ['college', 'TEXT'],
    ['sexualOrientations', 'TEXT'],
    ['descriptors', 'TEXT']
  ])
  const userInfosJSON =
    JSONPath({
      path: '$.User',
      json: TinderFile
    }) ?? []
  const userInfosItems = []
  userInfosJSON.forEach((v, i) => {
    userInfosItems.push({
      ageFilterMax: v.age_filter_max || 'Not mentioned',
      ageFilterMin: v.age_filter_min || 'Not mentioned',
      birthDate: v.birth_date || 'Not mentioned',
      createDate: v.create_date || 'Not mentioned',
      descriptors: JSON.stringify(v.descriptors) || 'Not mentioned',
      gender: v.gender || 'Not mentioned',
      genderFilter: v.gender_filter || 'Not mentioned',
      interestedIn: v.interested_in || 'Not mentioned',
      education: v.education || 'Not mentioned',
      college: v.college.toString() || 'Not mentioned',
      sexualOrientations: v.sexual_orientations.toString() || 'Not mentioned'
    })
  })
  db.insert('UserInfos', userInfosItems)

  /// Messages ////////////////////
  db.create('Messages', [
    ['sender', 'TEXT'],
    ['receiver', 'TEXT'],
    ['message', 'TEXT'],
    ['sentDate', 'TEXT']
  ])
  const messagesJSON =
    JSONPath({
      path: '$.Messages[*].messages[*]',
      json: TinderFile
    }) ?? []
  const messageItems = []
  messagesJSON.forEach((v, i) => {
    messageItems.push({
      sender: v.from,
      receiver: v.to,
      message: v.message,
      sentDate: v.sent_date
    })
  })
  db.insert('Messages', messageItems)

  /// Likes ////////////////////
  db.create('TinderDB', [
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
  db.insert('TinderDB', likesItems)

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
  db.insert('TinderDB', passesItems)

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
  db.insert('TinderDB', superlikesItems)

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
  db.insert('TinderDB', appOpenItems)

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
  db.insert('TinderDB', messagesReceivedItems)

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
  db.insert('TinderDB', messagesSentItems)

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
  db.insert('TinderDB', matchesItems)

  return db
}
