import type { ExperienceOptions } from '@/types/index'
import type {
  DatabaseConfig,
  DatabaseTable,
  DatabaseTables
} from '@/types/database-config'
import type { NonEmptyArray, PipelineOutputItems } from '@/types/utils'

import fs from 'fs'
import path from 'path'

import { camelCase } from 'lodash-es'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

import appleTracker from '../packages/experiences/apple-tracker/dist/index.mjs'
import facebook from '../packages/experiences/facebook/dist/index.mjs'
import google from '../packages/experiences/google/dist/index.mjs'
import her from '../packages/experiences/her/dist/index.mjs'
import instagram from '../packages/experiences/instagram/dist/index.mjs'
import linkedin from '../packages/experiences/linkedin/dist/index.mjs'
import netflix from '../packages/experiences/netflix/dist/index.mjs'
import tiktok from '../packages/experiences/tiktok/dist/index.mjs'
import tinder from '../packages/experiences/tinder/dist/index.mjs'
import trackerControl from '../packages/experiences/tracker-control/dist/index.mjs'
import twitter from '../packages/experiences/twitter/dist/index.mjs'
import uber from '../packages/experiences/uber/dist/index.mjs'
import uberDriver from '../packages/experiences/uber-driver/dist/index.mjs'

const experiences: { [key: string]: { options: ExperienceOptions } } = {
  appleTracker,
  facebook,
  google,
  her,
  instagram,
  linkedin,
  netflix,
  tiktok,
  tinder,
  trackerControl,
  twitter,
  uber,
  uberDriver
}

import { SQLType } from '../lib/types/database-config.js'
import { getCsvAndMergeFromID } from '../lib/pipelines/custom.js'
import DBMS from '../../data-experience/src/utils/sql.js'
import FileManager from '../../data-experience/src/utils/file-manager.js'
import NodeFile from '../../data-experience/src/utils/node-file.js'
// import fileManagerWorkers from '../../data-experience/utils/file-manager-workers.js'

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
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .parseSync()

const { experience, files } = argv

// ;(async () => {
// You can use await inside this function block
const nodeFiles = (files as string[]).map(filename => {
  const filePath = path.join(cwd, filename)
  const buffer = fs.readFileSync(filePath)
  const content = filename.endsWith('.zip') ? buffer : buffer.toString()
  return new NodeFile(filePath, content)
})

const { options } = experiences[experience as string]

const fileManager = new FileManager(
  options.preprocessors,
  null,
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

// export the database
const data = db.export()
const buffer = Buffer.from(data)
const writePath = path.join(cwd, 'sqlite')
if (!fs.existsSync(writePath)) {
  fs.mkdirSync(writePath, { recursive: true })
}
fs.writeFileSync(path.join(writePath, 'db.sqlite'), buffer)
