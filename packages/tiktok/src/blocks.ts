import type { ViewBlocks } from '@/types'
import comments from './sql/comments.sql'
import { genericViewers } from '@/pipelines/generic'
const blocks: ViewBlocks = [
  {
    id: 'comments',
    sql: comments,
    files: ['userdata'],
    showTable: true,
    title: 'Comments',
    text: 'Comments recieved'
  },
  ...genericViewers
]

export default blocks
