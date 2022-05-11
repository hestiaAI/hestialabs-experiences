import type { ViewBlocks } from '@/types'

import sqlComments from './sql/comments.sql'
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
  ...genericViewers
]

export default blocks
