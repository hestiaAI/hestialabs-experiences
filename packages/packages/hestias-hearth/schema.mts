#!/usr/bin/env node

import path from 'path'
import { writeFileSync } from 'fs'

import { ExperienceOptions } from '@/index.js'
import { createDatabaseAndGenerateRecords } from './utils/database.mjs'
import { createAndInitializeFileManager, createFiles } from './utils/file.mjs'
import { experiences } from './utils/experiences.mjs'

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const schema: Array<
  ExperienceOptions & {
    name: string
    slug: string
    version: string
  }
> = []

for (const xp of Object.values(experiences)) {
  const { name, version, options } = xp
  console.info(`\n[${name}@${version}]`)

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

  // options.databaseConfig.tables = options.databaseConfig.tables.map(({ columns, ...rest }) => ({
  //   // map columns Array to Object to add semantics
  //   columns: columns.map(([name, type, meta]) => ({ name, type, meta })),
  //   ...rest
  // }))
  schema.push(xp.config)
}

const filePath = path.join(__dirname, '../../../../schema.json')
writeFileSync(
  filePath,
  JSON.stringify(
    schema,
    (key, val) => {
      if (typeof val === 'function') {
        return '[function]'
      }
      switch (key) {
        case 'icon':
          return '[data URL]'
        case 'dataModel':
          return '[argonodes graph]'
        case 'keplerConfig':
          return '[kepler config]'
      }

      return val
    },
    2
  )
)

console.info(`\nSchema written to ${filePath}`)
console.info('Done')
