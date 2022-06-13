import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'TrackerControl',
      columns: [
        ['UID', TEXT],
        ['DAddr', TEXT],
        ['time', TEXT],
        ['Tracker', TEXT],
        ['Category', TEXT],
        ['Package', TEXT],
        ['App', TEXT],
        ['FilePath', TEXT, 'FILEPATH']
      ]
    }
  ],
  getters: [
    {
      fileId: 'tracker-control',
      path: '$.result.items[*]',
      table: 'TrackerControl',
      getters: [
        {
          column: 'UID',
          path: '$.uid'
        },
        {
          column: 'DAddr',
          path: '$.daddr'
        },
        {
          column: 'time',
          path: '$.date'
        },
        {
          column: 'Tracker',
          path: '$.Tracker'
        },
        {
          column: 'Category',
          path: '$.Category'
        },
        {
          column: 'Package',
          path: '$.Package'
        },
        {
          column: 'App',
          path: '$.App'
        }
      ]
    }
  ]
}

export default config
