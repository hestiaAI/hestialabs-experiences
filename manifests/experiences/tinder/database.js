// Tinder

import { JSONPath } from 'jsonpath-plus'
import { DB } from '~/utils/sql'

export default async function databaseBuilder(fileManager) {
  const db = new DB()
  await db.init()

  /// Likes ////////////////////
  db.create('TinderDB', [
    ['action', 'TEXT'],
    ['date', 'TEXT'],
    ['amount', 'INTEGER']
  ])
  const TinderFile = JSON.parse(
    await fileManager.getPreprocessedText('input.json')
  )
  const likesJSON = JSONPath({
    path: '$.Usage.swipes_likes[*]',
    json: TinderFile
  })
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

  /*
  /// Advertisters interacted with ////////////////////////////////////////////////////////////////////////////////
  db.create('advertisersInteractedWith', [
    ['title', 'TEXT'],
    ['action', 'TEXT'],
    ['timestamp', 'INTEGER']
  ])
  const advertisersInteractedWithFile = JSON.parse(
    await fileManager.getPreprocessedText(
      "ads_information/advertisers_you've_interacted_with.json"
    )
  )
  const advertisersInteracted = JSONPath({
    path: '$.history_v2[*]',
    json: advertisersInteractedWithFile
  })
  const advertisersInteractedItems = []
  advertisersInteracted.forEach((v, i) => {
    advertisersInteractedItems.push({
      id: i,
      title: v.title ?? null,
      action: v.action ?? null,
      timestamp: v.timestamp ?? null
    })
  })
  db.insert('advertisersInteractedWith', advertisersInteractedItems)

  /// Advertisers who purchased your contact ////////////////////////////////////////////////////////////////////////////////
  db.create('advertisersContactInformation', [['name', 'TEXT']])
  const advertisersContactInformationFile = JSON.parse(
    await fileManager.getPreprocessedText(
      'ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json'
    )
  )
  const advertisersContact = JSONPath({
    path: '$.custom_audiences_v2[*]',
    json: advertisersContactInformationFile
  })
  const advertisersContactInformationItems = []
  advertisersContact.forEach((v, i) => {
    advertisersContactInformationItems.push({
      id: i,
      name: v.advertiser
    })
  })
  db.insert('advertisersContactInformation', advertisersContactInformationItems)

  /// Off-Facebook activity ////////////////////////////////////////////////////////////////////////////////
  db.create('offFacebookActivityDatabase', [
    ['name', 'TEXT'],
    ['id', 'INTEGER'],
    ['type', 'TEXT'],
    ['timestamp', 'INTEGER']
  ])

  const offFacebookActivityFile = JSON.parse(
    await fileManager.getPreprocessedText(
      'apps_and_websites_off_of_facebook/your_off-facebook_activity.json'
    )
  )

  const offFacebookActivityJSON = JSONPath({
    path: '$.off_facebook_activity_v2[*]',
    json: offFacebookActivityFile
  })
  const offFacebookActivityItems = []
  offFacebookActivityJSON.forEach((v, i) => {
    const name = v.name
    const criteria = JSONPath({
      path: '$.events[*]',
      json: v
    })
    criteria.forEach((v, i) => {
      offFacebookActivityItems.push({
        id: i,
        name: name ?? null,
        type: v.type ?? null,
        timestamp: v.timestamp ?? null
      })
    })
  })
  db.insert('offFacebookActivityDatabase', offFacebookActivityItems)

  /// Inferred interests ////////////////////////////////////////////////////////////////////////////////
  db.create('inferredInterestsDatabase', [['name', 'TEXT']])
  const inferredInterestsFile = JSON.parse(
    await fileManager.getPreprocessedText(
      'other_logged_information/ads_interests.json'
    )
  )
  const inferredInterestsJSON = JSONPath({
    path: '$.topics_v2[*]',
    json: inferredInterestsFile
  })
  const inferredInterestsItems = []
  inferredInterestsJSON.forEach((v, i) => {
    inferredInterestsItems.push({
      id: i,
      name: v
    })
  })
  db.insert('inferredInterestsDatabase', inferredInterestsItems)
  */
}
