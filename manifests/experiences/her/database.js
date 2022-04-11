// Her

import { DB } from '~/utils/sql'
import { getCsvAndMergeFromID } from '~/utils/csv'

export default async function databaseBuilder(fileManager) {
  const db = new DB()
  await db.init()

  /// Likes ////////////////////
  const likedFile = await getCsvAndMergeFromID(fileManager, 'liked')
  db.create('herLikedDB', [
    ['name', 'TEXT'],
    ['likedat', 'TEXT'],
    ['matched', 'TEXT']
  ])
  db.insert(
    'herLikedDB',
    likedFile.items.map(i => {
      return { name: i.Name, likedat: i['Liked at'], matched: i.Matched }
    })
  )
  /// Notifications ////////////////////
  const notificationFile = await getCsvAndMergeFromID(
    fileManager,
    'notifications'
  )
  db.create('herNotificationsDB', [
    ['sender', 'TEXT'],
    ['notificationType', 'TEXT'],
    ['notificationSentAt', 'TEXT']
  ])
  db.insert(
    'herNotificationsDB',
    notificationFile.items.map(i => {
      return {
        sender: i.Sender,
        notificationType: i['Notification type'],
        notificationSentAt: i['Notifcation sent at']
      }
    })
  )
  /// Blocked ////////////////////
  const blockedFile = await getCsvAndMergeFromID(fileManager, 'blocked')
  db.create('herBlockedDB', [
    ['name', 'TEXT'],
    ['blockedat', 'TEXT']
  ])
  db.insert(
    'herBlockedDB',
    blockedFile.items.map(i => {
      return { name: i.Name, blockedat: i['Blocked at'] }
    })
  )
  /// Messages ////////////////////
  // Conversation,Message,Message type,Sender,Message Sent At
  const messagesFile = await getCsvAndMergeFromID(fileManager, 'messages')
  db.create('herMessagesDB', [
    ['conversationid', 'TEXT'],
    ['message', 'TEXT'],
    ['messagetype', 'TEXT'],
    ['sender', 'TEXT'],
    ['messagesentat', 'TEXT']
  ])
  db.insert(
    'herMessagesDB',
    messagesFile.items.map(i => {
      return {
        conversationid: i.Conversation,
        message: i.Message,
        messagetype: i['Message type'],
        sender: i.Sender,
        messagesentat: i['Message Sent At']
      }
    })
  )
  /// Reported ////////////////////
  // Reported type,Reason,Reported at
  const reportedFile = await getCsvAndMergeFromID(fileManager, 'reported')
  db.create('herReportedDB', [
    ['reportedtype', 'TEXT'],
    ['reason', 'TEXT'],
    ['reportedat', 'TEXT']
  ])
  db.insert(
    'herReportedDB',
    reportedFile.items.map(i => {
      return {
        reportedtype: i['Reported type'],
        reason: i.Reason,
        reportedat: i['Reported at']
      }
    })
  )
  /// Skipped ////////////////////
  // Name,Skipped at
  const skippedFile = await getCsvAndMergeFromID(fileManager, 'skipped')
  db.create('herSkippedDB', [
    ['name', 'TEXT'],
    ['skippedat', 'TEXT']
  ])
  db.insert(
    'herSkippedDB',
    skippedFile.items.map(i => {
      return {
        name: i.Name,
        skippedat: i['Skipped at']
      }
    })
  )
  /// Profile ////////////////////
  // Name,Full name,Birthday,Last online UTC,Registration_date UTC,Email,Push notifications enabled,Last used filters,Height in cm,Location,Custom Location,Status
  const profilesFile = await getCsvAndMergeFromID(fileManager, 'profiles')
  db.create('herProfilesDB', [
    ['name', 'TEXT'],
    ['fullname', 'TEXT'],
    ['birthday', 'TEXT'],
    ['lastonlineutc', 'TEXT'],
    ['registrationdateutc', 'TEXT'],
    ['email', 'TEXT'],
    ['pushnotificationsenabled', 'TEXT'],
    ['lastusedfilters', 'TEXT'],
    ['heightincm', 'TEXT'],
    ['location', 'TEXT'],
    ['customlocation', 'TEXT'],
    ['status', 'TEXT']
  ])
  db.insert(
    'herProfilesDB',
    profilesFile.items.map(i => {
      return {
        name: i.Name,
        fullname: i['Full name'],
        birthday: i.Birthday,
        lastonlineutc: i['Last online UTC'],
        registrationdateutc: i['Registration_date UTC'],
        email: i.Email,
        pushnotificationsenabled: i['Push notifications enabled'],
        lastusedfilters: i['Last used filters'],
        heightincm: i['Height in cm'],
        location: i.Location,
        customlocation: i['Custom Location'],
        status: i.Status
      }
    })
  )

  /// //////////////////
  return db
}
