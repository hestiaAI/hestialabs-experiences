#!/usr/bin/env node

import type { ExperienceOptions } from '@/types/index'
import type {
  DatabaseConfig,
  DatabaseTable,
  DatabaseTables
} from '@/types/database-config'
import type {
  NonEmptyArray,
  PipelineOutput,
  PipelineOutputItems
} from '@/types/utils'
import type { CustomPipeline } from '@/types/view-block'

import { homedir } from 'os'
import fs from 'fs'
import path from 'path'

import { camelCase } from 'lodash-es'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import packageJSON from './package.json' assert { type: 'json' }

import appleTracker from '../experiences/apple-tracker/dist/index.mjs'
import facebook from '../experiences/facebook/dist/index.mjs'
import google from '../experiences/google/dist/index.mjs'
import her from '../experiences/her/dist/index.mjs'
import instagram from '../experiences/instagram/dist/index.mjs'
import linkedin from '../experiences/linkedin/dist/index.mjs'
import netflix from '../experiences/netflix/dist/index.mjs'
import tiktok from '../experiences/tiktok/dist/index.mjs'
import tinder from '../experiences/tinder/dist/index.mjs'
import trackerControl from '../experiences/tracker-control/dist/index.mjs'
import twitter from '../experiences/twitter/dist/index.mjs'
import uber from '../experiences/uber/dist/index.mjs'
import uberDriver from '../experiences/uber-driver/dist/index.mjs'

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

import { SQLType } from '../../lib/types/database-config.js'
import { getCsvAndMergeFromID } from '../../lib/pipelines/custom.js'

import DBMS from '@hestia.ai/data-experience/src/utils/sql.js'
import FileManager from '@hestia.ai/data-experience/src/utils/file-manager.js'
import NodeFile from '@hestia.ai/data-experience/src/utils/node-file.js'
import genericPipelines from '@hestia.ai/data-experience/src/utils/generic-pipelines.js'

const pascalCase = (str: string) =>
  camelCase(str).replace(/^./, firstChar => firstChar.toUpperCase())

const outputDir = path.join(homedir(), 'hestias-hearth')
const outputDirViewBlocks = path.join(outputDir, 'view-blocks')
if (!fs.existsSync(outputDirViewBlocks)) {
  fs.mkdirSync(outputDirViewBlocks, { recursive: true })
}

const argv = yargs(hideBin(process.argv))
  .scriptName('hestias-hearth')
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
          describe: 'absolute paths to data files',
          array: true,
          type: 'array',
          alias: 'f',
          demandOption: true
        })
    }
  )
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .version(packageJSON.version)
  .parseSync()

const { experience, files } = argv

console.info('Creating Node Files...')
const nodeFiles = (files as string[]).map(filename => {
  const buffer = fs.readFileSync(filename)
  const content = filename.endsWith('.zip') ? buffer : buffer.toString()
  return new NodeFile(filename, content)
})

const { options } = experiences[experience as string]

console.info('Initializing File Manager...')
const fileManager = new FileManager(
  options.preprocessors,
  null,
  options.files,
  options.keepOnlyFiles
)

await fileManager.init(nodeFiles)

// create database
console.info('Creating Database...')
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
console.info('Inserting Database Records...')
console.info('Table names:', Object.keys(records))
DBMS.insertRecords(db, records)

// export the database
console.info('Exporting Database Records...')
const data = db.export()
const buffer = Buffer.from(data)

const filePath = path.join(outputDir, 'db.sqlite')
fs.writeFileSync(filePath, buffer)

console.info(`Database Exported to ${filePath}`)

console.info('Writing View-Block Outputs...')
for (const {
  id,
  customPipeline,
  customPipelineOptions,
  sql,
  postprocessor,
  overlay
} of options.viewBlocks) {
  let results: PipelineOutput | { rawCsv: string; config: object }
  if (customPipeline) {
    let pipeline: string | CustomPipeline = customPipeline
    if (typeof pipeline === 'string') {
      pipeline = (genericPipelines as { [key: string]: CustomPipeline })[
        pipeline
      ]
    }
    results = await pipeline({ fileManager, options: customPipelineOptions })
  } else if (sql) {
    results = db.select(sql)
  } else if (overlay) {
    break
  } else {
    throw new TypeError('Invalid view-block')
  }

  if (results && ('rawCsv' in results || results.headers.length)) {
    if (postprocessor && 'headers' in results) {
      results = postprocessor(results as PipelineOutput)
    }
    const viewBlockFile = path.join(outputDirViewBlocks, `${id}.json`)
    fs.writeFileSync(viewBlockFile, JSON.stringify(results, null, 2))
    console.info(`[${id}]: ${viewBlockFile.replace(/\\/g, '/')}`)
  } else {
    console.warn(`[${id}]: No results`)
  }
}

console.info('Done')
