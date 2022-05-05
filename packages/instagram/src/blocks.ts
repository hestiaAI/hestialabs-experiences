import type { ViewBlocks } from '@/types'

import sqlComments from './sql/comments.sql'

const blocks: ViewBlocks = [
  {
    id: 'comments',
    sql: sqlComments,
    files: ['comments'],
    showTable: true,
    title: 'Comments',
    text: 'Comments recieved'
  }
]

export default blocks
