import type { ViewBlocks } from '@/types'
import loginhistory from './sql/loginhistory.sql'
import activityhistory from './sql/activity-history.sql'
import followingfollower from './sql/following-vs-follower.sql'
import followinglist from './sql/followinglist.sql'
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
          cols: '8',
          type: 'TimelineChart.vue',
          dateAccessor: 'date'
        },
        {
          type: 'WeekChart.vue',
          cols: '4',
          dateAccessor: 'date'
        },
        {
          type: 'HourChart.vue',
          cols: '4',
          height: 220,
          dateAccessor: 'date'
        },
        {
          title: 'Network Type',
          cols: '4',
          height: 220,
          type: 'PieChart.vue',
          valueAccessor: 'networktype'
        },
        {
          title: 'Carrier',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'carrier'
        },
        {
          title: 'Device System',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'devicesystem'
        },
        {
          title: 'Device Model',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'devicemodel'
        },
        {
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
    showTable: true,
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      title: 'Following vs Follower over time',
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
    showTable: true,
    title: 'Activity History',
    text: 'Consult every actions you have made on the app.'
  },
  {
    id: 'chathistory',
    sql: chathistory,
    files: ['userdata'],
    showTable: true,
    visualization: 'ChartViewHeatMapCalendar.vue',
    vizProps: {
      title: 'rtess',
      dateAccessor: 'date'
    },
    title: 'Chat Activity',
    text: 'Private messages sent and received'
  }
]

export default blocks
