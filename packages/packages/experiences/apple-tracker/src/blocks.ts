import type { ViewBlocks } from '@/types'
import sqlIOSNetwork from './sql/all-ios-network.sql'
import sqlIOSAccess from './sql/all-ios-access.sql'

const blocks: ViewBlocks = [
  {
    id: 'IOSNetwork',
    sql: sqlIOSNetwork,
    files: ['tracker-control-ios'],
    visualization: 'ChartViewIOSNetworkActivity.vue',
    showTable: false,
    title: 'Network Activity',
    text: 'Explore every connection made by your applications to a particular domain. The result is limited to the last two weeks since you activated the App Privacy Report.'
  },
  {
    id: 'IOSAccess',
    sql: sqlIOSAccess,
    files: ['tracker-control-ios'],
    visualization: 'ChartViewIOSAccess.vue',
    showTable: false,
    title: 'Resource Access',
    text: 'Explore every access your apps have made to a resource on your device. The result is limited to the last two weeks since you activated the App Privacy Report.'
  }
]

export default blocks
