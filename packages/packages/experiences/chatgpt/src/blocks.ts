import type { ViewBlocks } from '@/types'
import sqlMessages from './sql/messages.sql'

const blocks: ViewBlocks = [
  {
    id: 'messages',
    sql: sqlMessages,
    title: 'Activity',
    text: 'See your activity on ChatGPT',
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          title: 'Number of messages',
          valueLabel: 'messages',
          cols: '8',
          type: 'TimelineChart.vue',
          dateAccessor: 'createTime'
        },
        {
          title: 'Author',
          valueLabel: 'messages',
          cols: '4',
          type: 'PieChart.vue',
          valueAccessor: 'role'
        },
        {
          cols: '4',
          type: 'HourChart.vue',
          dateAccessor: 'createTime'
        },
        {
          valueLabel: 'logins',
          type: 'WeekChart.vue',
          cols: '4',
          dateAccessor: 'createTime'
        },
        {
          title: 'Top Discussion',
          valueLabel: 'messages',
          cols: '4',
          type: 'TopChart.vue',
          height: 220,
          valueAccessor: 'convTitle'
        }
      ]
    },
    showTable: false
  }
]

export default blocks
