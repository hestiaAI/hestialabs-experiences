import type { ViewBlocks } from '@/types'

import sqlComments from './sql/comments.sql'
import sqlConnections from './sql/connections.sql'
import sqlContacts from './sql/contacts.sql'
import sqlLikes from './sql/likes.sql'
import sqlPhotos from './sql/photos.sql'
import sqlMessages from './sql/messages.sql'
import sqlSavedcollections from './sql/saved-collections.sql'
import sqlSearches from './sql/searches.sql'
import { genericViewers } from '@/pipelines/generic'

const blocks: ViewBlocks = [
  {
    id: 'comments',
    sql: sqlComments,
    files: ['comments'],
    showTable: true,
    title: 'Comments',
    text: 'Comments recieved'
  },
  {
    id: 'connections',
    sql: sqlConnections,
    files: ['connections'],
    showTable: true,
    title: 'Connections',
    text: 'Connections to other users or hashtags'
  },
  {
    id: 'contacts',
    sql: sqlContacts,
    files: ['contacts'],
    showTable: true,
    title: 'Contacts',
    text: 'Not implemented for lack of test data'
  },
  {
    id: 'likes',
    sql: sqlLikes,
    files: ['likes'],
    showTable: true,
    title: 'Likes',
    text: ''
  },
  {
    id: 'photos',
    sql: sqlPhotos,
    files: ['media'],
    showTable: true,
    title: 'Photos',
    text: ''
  },
  {
    id: 'messages',
    sql: sqlMessages,
    files: ['messages'],
    showTable: true,
    title: 'Messages',
    text: ''
  },
  {
    id: 'savedcollections',
    sql: sqlSavedcollections,
    files: ['saved'],
    showTable: true,
    title: 'Saved Collections',
    text: ''
  },
  {
    id: 'searches',
    sql: sqlSearches,
    files: ['searches'],
    showTable: true,
    title: 'Searches',
    text: 'Queries you have issued to the search engine of Instagram'
  },
  ...genericViewers
]

export default blocks
