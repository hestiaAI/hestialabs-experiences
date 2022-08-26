import type { ViewBlocks } from '@/types'
import loginhistory from './sql/loginhistory.sql'
import activityhistory from './sql/activity-history.sql'
import followingfollower from './sql/following-vs-follower.sql'
import chathistory from './sql/chat-history.sql'
const blocks: ViewBlocks = [
  {
    id: 'loginhistory',
    sql: loginhistory,
    files: ['userdata'],
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          title: 'Number of login',
          valueLabel: 'logins',
          cols: '8',
          type: 'TimelineChart.vue',
          dateAccessor: 'date'
        },
        {
          valueLabel: 'logins',
          type: 'WeekChart.vue',
          cols: '4',
          dateAccessor: 'date'
        },
        {
          valueLabel: 'logins',
          type: 'HourChart.vue',
          cols: '4',
          height: 220,
          dateAccessor: 'date'
        },
        {
          valueLabel: 'logins',
          title: 'Network Type',
          cols: '4',
          height: 220,
          type: 'PieChart.vue',
          valueAccessor: 'networktype'
        },
        {
          valueLabel: 'logins',
          title: 'Carrier',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'carrier'
        },
        {
          valueLabel: 'logins',
          title: 'Device System',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'devicesystem'
        },
        {
          valueLabel: 'logins',
          title: 'Device Model',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'devicemodel'
        },
        {
          valueLabel: 'logins',
          title: 'IP',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'ip'
        }
      ]
    },
    showTable: false,
    title: 'Login History',
    text: 'When and where you logged in'
  },
  {
    id: 'followingfollower',
    sql: followingfollower,
    files: ['userdata'],
    showTable: false,
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      title: 'Following vs Follower over time',
      cumSum: true,
      yLabel: 'Total',
      legendOffset: 350,
      dateAccessor: { text: 'Date', value: 'date_' },
      seriesAccessor: { text: 'Action', value: 'actionType' },
      valueAccessor: 'count_'
    },
    title: 'Following vs Follower',
    text: 'See how much you have follow or have been followed during time'
  },
  {
    id: 'activityhistory',
    sql: activityhistory,
    files: ['userdata'],
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          title: 'Number of actions',
          valueLabel: 'actions',
          cols: '8',
          type: 'TimelineChart.vue',
          dateAccessor: 'date_'
        },
        {
          title: 'Type of action',
          cols: '4',
          type: 'TopChart.vue',
          valueAccessor: 'activityType'
        },
        {
          type: 'WeekChart.vue',
          cols: '6',
          height: 220,
          dateAccessor: 'date_'
        },
        {
          type: 'HourChart.vue',
          cols: '6',
          height: 220,
          dateAccessor: 'date_'
        }
      ]
    },
    showTable: false,
    title: 'Activity History',
    text: 'Consult every actions you have made on the app.'
  },
  {
    id: 'chathistory',
    sql: chathistory,
    files: ['userdata'],
    showTable: false,
    visualization: 'ChartViewHeatMapHour.vue',
    vizProps: {
      dateAccessor: 'date'
    },
    title: 'Chat Activity',
    text: 'Private messages sent and received'
  }
]

export default blocks
