import type { ExperienceOptions } from '@/types/index'
import type {
  DatabaseConfig,
  DatabaseTable,
  DatabaseTables
} from '@/types/database-config'
import type { NonEmptyArray, PipelineOutputItems } from '@/types/utils'

import fs from 'fs'
import path from 'path'

import { camelCase } from 'lodash'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import experiences from '@hestia.ai/hestialabs/dist/index.mjs'

import { SQLType } from '../lib/types/database-config.js'
import { getCsvAndMergeFromID } from '../lib/pipelines/custom.js'
import DBMS from '../../data-experience/src/utils/sql.js'
import FileManagerClass from '../../data-experience/src/utils/file-manager.js'
import { NodeFile } from '../../data-experience/src/utils/node-file.js'
import fileManagerWorkers from '../../data-experience/src/utils/file-manager-workers.js'

const pascalCase = (str: string) =>
  camelCase(str).replace(/^./, firstChar => firstChar.toUpperCase())

const { TEXT } = SQLType

const cwd = process.cwd()

const argv = yargs(hideBin(process.argv))
  .scriptName('hestia-hearth')
  .usage('$0 <cmd> [args]')
  .command(
    'fire <experience>',
    'Place input data over Hestia’s hearth',
    yyargs => {
      yyargs
        .positional('experience', {
          describe: 'the unique id of the data experience',
          type: 'string',
          choices: Object.keys(experiences)
        })
        .option('files', {
          describe:
            'input file paths relative to the current working directory',
          array: true,
          type: 'array',
          alias: 'f',
          demandOption: true
        })
    }
  )
  .help()
  .parseSync()

const { experience, files } = argv
console.log(experience, files)

const nodeFiles = (files as string[]).map(filename => {
  const filePath = path.join(cwd, filename)
  const buffer = fs.readFileSync(filePath)
  return new NodeFile(filename, buffer.toString())
})

const { options }: { options: ExperienceOptions } =
  experiences[experience as string]

const fileManager = new FileManagerClass(
  options.preprocessors,
  fileManagerWorkers,
  options.files,
  options.keepOnlyFiles
)

await fileManager.init(nodeFiles)
// create database
let db
let records
if (options.databaseConfig) {
  db = await DBMS.createDB(options.databaseConfig)
  // generate database records via the file manager
  records = await DBMS.generateRecords(fileManager, options.databaseConfig)
} else {
  const data: Array<{
    tableName: string
    headers: string[]
    items: PipelineOutputItems
  }> = []
  for (const [id, glob] of Object.entries(options.files ?? [])) {
    const { headers, items } = await getCsvAndMergeFromID(fileManager, glob)
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
      const columns: NonEmptyArray<[string, SQLType]> = [[headers[0], TEXT]]
      headers.slice(1).forEach(h => columns.push([h, SQLType.TEXT]))
      const table: DatabaseTable = {
        name: tableName,
        columns
      }
      return table
    })

    const databaseConfig: Partial<DatabaseConfig> = {
      tables: tables as DatabaseTables
    }
    db = await DBMS.createDB(databaseConfig)
    records = Object.fromEntries(
      dataFiltered.map(({ tableName, items }) => [tableName, items])
    )
  } else {
    throw new Error('No data')
  }
}
// insert the records into the database
DBMS.insertRecords(db, records)

const data = db.export()
const buffer = Buffer.from(data)
console.log(data, buffer)
const writePath = path.join(cwd, 'sqlite/db.sqlite')
if (!fs.existsSync(writePath)) {
  fs.mkdirSync(writePath)
}
fs.writeFileSync(writePath, buffer)

// writeFileSync(path.join(cwd, `${id}.csv`), csv.toBuffer(utf8))
