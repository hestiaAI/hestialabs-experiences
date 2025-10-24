import type {
  DatabaseConfig,
  DatabaseTable,
  DatabaseTables
} from '@/types/database-config'
import type { NonEmptyArray, PipelineOutputItems } from '@/types/utils'
import { ExperienceOptions } from '@/types'

import { camelCase } from 'lodash-es'

import { SQLType } from '../../../lib/types/database-config.js'
import { getCsvAndMergeFromID } from '../../../lib/pipelines/custom.js'

import DBMS from '@hestia.ai/data-experience/src/utils/sql.js'
import FileManager from '@hestia.ai/data-experience/src/utils/file-manager.js'

const pascalCase = (str: string) =>
  camelCase(str).replace(/^./, firstChar => firstChar.toUpperCase())

export async function createDatabaseAndGenerateRecords(
  fileManager: FileManager,
  options: ExperienceOptions
) {
  let db
  let records
  if (options.databaseConfig) {
    db = await DBMS.createDB(options.databaseConfig)
    // generate database records via the file manager
    records = await DBMS.generateRecords(fileManager, options.databaseConfig)
  } else {
    // generate records manually when no database config is provided
    const data: Array<{
      tableName: string
      headers: string[]
      items: PipelineOutputItems
    }> = []
    for (const id of Object.keys(options.files ?? [])) {
      const { headers, items } = await getCsvAndMergeFromID(fileManager, id)
      data.push({
        tableName: pascalCase(id),
        headers: headers as string[],
        items
      })
    }

    // ignore empty tables
    const dataFiltered = data.filter(({ headers }) => headers.length)

    if (dataFiltered.length) {
      const tables = dataFiltered.map(({ tableName, headers }) => {
        const columns: NonEmptyArray<[string, SQLType]> = [
          [headers[0], SQLType.TEXT]
        ]
        headers.slice(1).forEach(h => columns.push([h, SQLType.TEXT]))
        const table: DatabaseTable = {
          name: tableName,
          columns
        }
        return table
      })

      const databaseConfig: DatabaseConfig = {
        tables: tables as DatabaseTables
      }
      // assign to options for accessing it in the caller
      options.databaseConfig = databaseConfig
      db = await DBMS.createDB(databaseConfig)
      records = Object.fromEntries(
        dataFiltered.map(({ tableName, items }) => [tableName, items])
      )
    } else {
      throw new Error('No data')
    }
  }
  return {
    db,
    records
  }
}
