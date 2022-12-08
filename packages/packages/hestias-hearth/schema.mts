#!/usr/bin/env node

import path from 'path'
import { writeFileSync } from 'fs'

import { createDatabaseAndGenerateRecords } from './utils/database.mjs'
import { createAndInitializeFileManager, createFiles } from './utils/file.mjs'
import { experiences } from './utils/experiences.mjs'

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const schema: {
  [key: string]: {
    database: {
      tables: {
        name: string
        columns: {
          name: string
          type: string
          meta?: string
        }[]
      }[]
    }
    tabs: object[]
  }
} = {}

for (const xp of Object.values(experiences)) {
  const { name, options } = xp
  console.info(`\n[${name}]`)

  console.info('Creating Node Files...')
  const fileBaseURL = path.join(__dirname, '../../../../../../lib/data-samples')
  const filePaths = (options.dataSamples || [])
    .map(githubURL => githubURL.match(/data-samples\/(.+)[?]/))
    .map(match => (match && match.length > 1 ? match[1] : ''))
    .map(filename => path.join(fileBaseURL, filename))
  const nodeFiles = await createFiles(filePaths)

  console.info('Initializing File Manager...')
  const fileManager = await createAndInitializeFileManager(options, nodeFiles)

  // create database to ensure databaseConfig is created when it's not there
  if (!options.databaseConfig) {
    console.info('Creating Database...')
    await createDatabaseAndGenerateRecords(fileManager, options)
    if (!options.databaseConfig) {
      throw new Error('databaseConfig is missing')
    }
  }

  schema[name] = {
    database: {
      tables: options.databaseConfig.tables.map(({ columns, ...rest }) => ({
        // map columns Array to Object to add semantics
        columns: columns.map(([name, type, meta]) => ({ name, type, meta })),
        ...rest
      }))
    },
    tabs: options.viewBlocks
      .map(block =>
        Object.fromEntries(
          Object.entries(block)
            // exclude functions
            .filter(b => typeof b[1] !== 'function')
        )
      )
      .map(({ sql, ...rest }) => ({
        sql:
          typeof sql === 'undefined'
            ? undefined
            : // replace whitespace in SQL string
              (sql as string).replace(/\s+/g, ' '),
        ...rest
      }))
  }
}

const filePath = path.join(__dirname, '../../../../schema.json')
writeFileSync(filePath, JSON.stringify(schema, null, 2))

console.info(`\nSchema written to ${filePath}`)
console.info('Done')
