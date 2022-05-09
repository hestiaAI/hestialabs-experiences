import type { ViewBlocks } from '@/types'
import comments from './sql/comments.sql'
const blocks: ViewBlocks = [
  {
    id: 'comments',
    sql: comments,
    files: ['userdata'],
    showTable: true,
    title: 'Comments',
    text: 'Comments recieved'
  }
]

export default blocks
