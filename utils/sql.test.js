import { DB } from '@/utils/sql'

// The .wasm file import must be mocked, see jest.moduleNameMapper in package.json

test('initialize the database', async () => {
  const db = new DB()
  await db.init()
})
