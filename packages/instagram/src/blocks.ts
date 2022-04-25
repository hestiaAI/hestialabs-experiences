import type { ViewBlocks } from '@/types/view-block'

import sqlComments from './sql/comments.sql'

const blocks: ViewBlocks = [
  {
    key: 'comments',
    sql: sqlComments,
    files: ['comments'],
    showTable: true,
    title: 'Comments',
    text: 'Comments recieved'
  }
]

export default blocks
