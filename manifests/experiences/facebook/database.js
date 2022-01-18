// Facebook

import { JSONPath } from 'jsonpath-plus'
import { DB } from '@/utils/sql'

async function getFileFromGlob(glob, fileManager) {
  const matches = fileManager.findMatchingFilePaths(glob)
  if (matches.length === 0) {
    return '{}'
  } else if (matches.length > 1) {
    console.warn(`File ${glob} was found multiple times`)
  }
  const file = await fileManager.getPreprocessedText(matches[0])
  return JSON.parse(file)
}

export default async function databaseBuilder(fileManager) {
  const db = new DB()
  await db.init()

  /// Advertisters interacted with ////////////////////////////////////////////////////////////////////////////////
  db.create('advertisersInteractedWith', [
    ['title', 'TEXT'],
    ['action', 'TEXT'],
    ['timestamp', 'INTEGER']
  ])
  const advertisersInteractedWithFile = await getFileFromGlob(
    "**/ads_information/advertisers_you've_interacted_with.json",
    fileManager
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
  const advertisersContactInformationFile = await getFileFromGlob(
    '**/ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json',
    fileManager
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

  const offFacebookActivityFile = await getFileFromGlob(
    '**/apps_and_websites_off_of_facebook/your_off-facebook_activity.json',
    fileManager
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
  const inferredInterestsFile = await getFileFromGlob(
    '**/other_logged_information/ads_interests.json',
    fileManager
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

  return db
}
