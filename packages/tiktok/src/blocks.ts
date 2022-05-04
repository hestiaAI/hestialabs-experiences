import type { ViewBlocks } from '@/types/view-block'

const files = ['tinder']

const blocks: ViewBlocks = [
  {
    id: 'comments',
    sql: 'comments',
    files: ['comments'],
    showTable: true,
    title: 'Comments',
    text: 'Comments recieved'
  }
]

export default blocks
