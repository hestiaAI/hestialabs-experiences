// Her

import { DB } from '~/utils/sql'
import { getCsvAndMergeFromID } from '~/utils/csv'

export default async function databaseBuilder(fileManager) {
  const db = new DB()
  await db.init()

  // Several CSV files in a Her export
  const likedFile = await getCsvAndMergeFromID(fileManager, 'liked')

  /// Likes ////////////////////
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
  /// //////////////////
  return db
}
