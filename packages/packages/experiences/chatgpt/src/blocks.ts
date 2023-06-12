import type { ViewBlocks } from '@/types'
import sqlMessages from './sql/messages.sql'

const blocks: ViewBlocks = [
  {
    id: 'messages',
    sql: sqlMessages,
    title: 'Activity',
    text: 'See your activity on ChatGPT',
    showTable: true,
    overlay: 'Available soon!'
  }
]

export default blocks
