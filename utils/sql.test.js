import { DB } from '@/utils/sql'

// The .wasm file import must be mocked, see jest.moduleNameMapper in package.json

const testTable = [
  'test',
  [
    ['id', 'INTEGER'],
    ['description', 'TEXT'],
    ['time', 'DATE'],
    ['ratio', 'FLOAT']
  ]
]

const testTableWrongTableName = ['test', [['foo$bar', 'INTEGER']]]
const testTableWrongColumnName = ['test', [['foo$bar', 'INTEGER']]]
const testTableWrongType = ['test', [['id', 'FOO']]]
const testTableMissingType = ['test', [['id']]]

const testItems = [
  { id: 0, description: 'hello world', time: '2021-12-31', ratio: 0.5 },
  { id: 1, description: 'foo bar', time: '2022-01-01', ratio: 0.33 }
]
const testData = {
  headers: ['id', 'description', 'time', 'ratio'],
  items: testItems
}

const testWrongItems = [
  { id: 0, description: 'hello world' },
  { id: 1, description: 'foo bar', time: '2022-01-01', ratio: 0.33 }
]

async function newDB() {
  const db = new DB()
  await db.init()
  return db
}

test('initializing and closing a database without error', async () => {
  const db = await newDB()
  db.close()
})

describe('creating a table', () => {
  test('without error', async () => {
    const db = await newDB()
    db.create(...testTable)
    db.close()
  })

  test('with a wrong table name throws an error', async () => {
    const db = await newDB()
    expect(() => db.create(...testTableWrongTableName)).toThrow()
    db.close()
  })

  test('with a wrong column name throws an error', async () => {
    const db = await newDB()
    expect(() => db.create(...testTableWrongColumnName)).toThrow()
    db.close()
  })

  test('with a wrong column type throws an error', async () => {
    const db = await newDB()
    expect(() => db.create(...testTableWrongType)).toThrow()
    db.close()
  })

  test('with a missing type throws an error', async () => {
    const db = await newDB()
    expect(() => db.create(...testTableMissingType)).toThrow()
    db.close()
  })
})

describe('inserting elements', () => {
  test('without error', async () => {
    const db = await newDB()
    db.create(...testTable)
    db.insert(testTable[0], testItems)
    db.close()
  })

  test('with a wrong table name throws an error', async () => {
    const db = await newDB()
    db.create(...testTable)
    expect(() => db.insert('foobar', testItems)).toThrow()
    db.close()
  })

  test('with wrongly formatted items throws an error', async () => {
    const db = await newDB()
    db.create(...testTable)
    expect(() => db.insert(testTable[0], testWrongItems)).toThrow()
    db.close()
  })
})

describe('selecting', () => {
  test('all elements returns the correct elements', async () => {
    const db = await newDB()
    db.create(...testTable)
    db.insert(testTable[0], testItems)
    expect(db.select('SELECT * FROM test')).toEqual(testData)
    db.close()
  })

  test('an element that is not present returns an empty data object', async () => {
    const db = await newDB()
    db.create(...testTable)
    db.insert(testTable[0], testItems)
    expect(db.select('SELECT * FROM test WHERE id=42')).toEqual({
      headers: [],
      items: []
    })
    db.close()
  })
})
