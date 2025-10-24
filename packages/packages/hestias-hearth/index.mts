#!/usr/bin/env node

import type { PipelineOutput } from '@/types/utils'
import type { CustomPipeline } from '@/types/view-block'

import { homedir } from 'os'
import fs from 'fs'
import path from 'path'

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

import { experiences } from './utils/experiences.mjs'
import { createDatabaseAndGenerateRecords } from './utils/database.mjs'
import { createAndInitializeFileManager, createFiles } from './utils/file.mjs'
import packageJSON from './package.json' assert { type: 'json' }

import DBMS from '@hestia.ai/data-experience/src/utils/sql.js'
import genericPipelines from '@hestia.ai/data-experience/src/utils/generic-pipelines.js'

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
const nodeFiles = await createFiles(files as string[])

const { options } = experiences[experience as string]

console.info('Initializing File Manager...')
const fileManager = await createAndInitializeFileManager(options, nodeFiles)

// create database
console.info('Creating Database...')
const { db, records } = await createDatabaseAndGenerateRecords(
  fileManager,
  options
)

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
