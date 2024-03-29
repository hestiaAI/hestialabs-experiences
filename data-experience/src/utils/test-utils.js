import DBMS from '~/utils/sql'
import FileManager from '~/utils/file-manager'

export class DatabaseTester {
  database

  async init(
    { options: { databaseConfig, preprocessors, files, keepOnlyFiles } },
    mockedFiles
  ) {
    if (!databaseConfig) {
      throw new Error('databaseConfig is not defined')
    }
    const fileManager = new FileManager(
      preprocessors,
      null,
      files,
      keepOnlyFiles
    )
    await fileManager.init(mockedFiles)
    const database = await DBMS.createDB(databaseConfig)
    const records = await DBMS.generateRecords(fileManager, databaseConfig)
    DBMS.insertRecords(database, records)

    this.database = database
  }

  select(sql) {
    return this.database.select(sql)
  }

  close() {
    this.database.close()
  }
}

export function arrayEqualNoOrder(array1, array2) {
  expect(array1.length).toBe(array2.length)
  array2.forEach(x => expect(array1).toContainEqual(x))
  array1.forEach(x => expect(array2).toContainEqual(x))
}

export function getSqlFromBlock({ options: { viewBlocks } }, id) {
  const { sql = '' } = viewBlocks.find(b => b.id === id)
  return sql
}

export function getCustomPipelineFromBlock(experience, id) {
  const { customPipeline } = getViewBlock(experience, id)
  if (typeof customPipeline !== 'function') {
    throw new TypeError(`customPipeline in view block with id ${id} is not a function`)
  }
  return customPipeline
}

export function getViewBlock(experience, viewBlockId) {
  return experience?.options?.viewBlocks?.find(b => b.id === viewBlockId)
}
