import type { ViewBlocks } from '@/types'
import sqlIOSNetwork from '../../apple-tracker/src/sql/all-ios-network.sql'
import sqlIOSAccess from '../../apple-tracker/src/sql/all-ios-access.sql'

const blocks: ViewBlocks = [
  {
    id: 'IOSNetwork',
    sql: sqlIOSNetwork,
    files: ['network'],
    visualization: 'ChartViewIOSNetworkActivity.vue',
    showTable: false,
    title: 'Network Activity',
    text: 'Explore every connection made by your applications to a particular domain. The result is limited to the last two weeks since you activated the App Privacy Report.'
  },
  {
    id: 'IOSAccess',
    sql: sqlIOSAccess,
    files: ['access'],
    visualization: 'ChartViewIOSAccess.vue',
    showTable: false,
    title: 'Resource Access',
    text: 'Explore every access your apps have made to a resource on your device. The result is limited to the last two weeks since you activated the App Privacy Report.'
  }
]

export default blocks
