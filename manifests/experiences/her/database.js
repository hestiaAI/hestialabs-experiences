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
  /// //////////////////
  return db
}
