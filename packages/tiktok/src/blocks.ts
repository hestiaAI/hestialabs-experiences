import type { ViewBlocks } from '@/types'
import fanlist from './sql/fanlist.sql'
import followinglist from './sql/followinglist.sql'
import likelist from './sql/likelist.sql'
import loginhistory from './sql/loginhistory.sql'
import searchhistory from './sql/searchhistory.sql'
import sharehistory from './sql/sharehistory.sql'
import comments from './sql/comments.sql'
import chathistory from './sql/chathistory.sql'
import { genericViewers } from '@/pipelines/generic'
const blocks: ViewBlocks = [
  {
    id: 'fanlist',
    sql: fanlist,
    files: ['userdata'],
    showTable: true,
    title: 'Fan list',
    text: 'Users who follow you'
  },
  {
    id: 'followinglist',
    sql: followinglist,
    files: ['userdata'],
    showTable: true,
    title: 'Following list',
    text: 'Users whom you follow'
  },
  {
    id: 'likelist',
    sql: likelist,
    files: ['userdata'],
    showTable: true,
    title: 'Like list',
    text: 'Posts that you liked'
  },
  {
    id: 'loginhistory',
    sql: loginhistory,
    files: ['userdata'],
    showTable: true,
    title: 'Login History',
    text: 'When and where you logged in'
  },
  {
    id: 'searchhistory',
    sql: searchhistory,
    files: ['userdata'],
    showTable: true,
    title: 'Search History',
    text: 'What you searched'
  },
  {
    id: 'sharehistory',
    sql: sharehistory,
    files: ['userdata'],
    showTable: true,
    title: 'Share History',
    text: 'Items you shared'
  },
  {
    id: 'comments',
    sql: comments,
    files: ['userdata'],
    showTable: true,
    title: 'Comments',
    text: 'Comments received'
  },
  {
    id: 'chathistory',
    sql: chathistory,
    files: ['userdata'],
    showTable: true,
    title: 'Chat History',
    text: 'Private messages sent and received'
  }
    text: 'Comments recieved'
  },
  ...genericViewers
]

export default blocks
