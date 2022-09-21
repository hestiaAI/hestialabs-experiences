import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'TrackerControl',
      columns: [
        ['uid', TEXT],
        ['daddr', TEXT],
        ['time', TEXT],
        ['tracker', TEXT],
        ['category', TEXT],
        ['package', TEXT],
        ['app', TEXT],
        ['filePath', TEXT, 'FILEPATH']
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
          column: 'uid',
          path: '$.uid'
        },
        {
          column: 'daddr',
          path: '$.daddr'
        },
        {
          column: 'time',
          path: '$.time'
        },
        {
          column: 'tracker',
          path: '$.tracker'
        },
        {
          column: 'category',
          path: '$.category'
        },
        {
          column: 'package',
          path: '$.package'
        },
        {
          column: 'app',
          path: '$.app'
        }
      ]
    }
  ]
}

export default config
