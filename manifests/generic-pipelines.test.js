import { jsonToTableConverter } from '~/manifests/generic-pipelines'
import { mockFileManager } from '~/utils/__mocks__/file-manager-mock'

test('jsonToTableConverter with properties', async () => {
  const fileName = 'comments_and_reactions/comments.json'
  const content = {
    comments_v2: [
      {
        timestamp: 1000000000,
        comment: 'one comment',
        name: 'hello',
        ne: { foo: 'boo' },
        list: ['one', 'two']
      },
      {
        timestamp: 1000000001,
        comment: 'another comment',
        name: 'toto',
        list: ['three', 'four']
      }
    ]
  }
  const fileManager = await mockFileManager(fileName, JSON.stringify(content))

  const options = {
    accessor: {
      filePath: 'comments_and_reactions/comments.json',
      jsonPath: '$.comments_v2[*]'
    },
    columns: [
      {
        name: 'Timestamp',
        jsonPath: 'timestamp'
      },
      {
        name: 'comment'
      },
      {
        name: 'Nested',
        jsonPath: 'ne.foo'
      },
      {
        name: 'list0',
        jsonPath: 'list[0]'
      }
    ]
  }

  expect(fileManager.hasFile(fileName)).toBe(true)
  const bobo = await fileManager.getText(fileName)
  expect(bobo).toStrictEqual(JSON.stringify(content))

  const tableData = await jsonToTableConverter({ fileManager, options })
  const correct = {
    headers: ['Timestamp', 'comment', 'Nested', 'list0'],
    items: [
      {
        Timestamp: 1000000000,
        comment: 'one comment',
        Nested: 'boo',
        list0: 'one'
      },
      {
        Timestamp: 1000000001,
        comment: 'another comment',
        Nested: '',
        list0: 'three'
      }
    ]
  }
  expect(tableData).toStrictEqual(correct)
})

test('jsonToTableConverter without properties', async () => {
  const fileName = 'comments_and_reactions/comments.json'
  const content = {
    comments_v2: [
      { timestamp: 1000000000, comment: 'one comment', name: 'hello' },
      { timestamp: 1000000001, comment: 'another comment', name: 'toto' }
    ]
  }
  const fileManager = await mockFileManager(fileName, JSON.stringify(content))

  const options = {
    accessor: {
      filePath: 'comments_and_reactions/comments.json',
      jsonPath: '$.comments_v2[*]'
    }
  }

  expect(fileManager.hasFile(fileName)).toBe(true)
  const bobo = await fileManager.getText(fileName)
  expect(bobo).toStrictEqual(JSON.stringify(content))

  const tableData = await jsonToTableConverter({ fileManager, options })
  const correct = {
    headers: ['timestamp', 'comment', 'name'],
    items: content.comments_v2
  }
  expect(tableData).toStrictEqual(correct)
})

test('jsonToTableConverter without properties and varying objects', async () => {
  const fileName = 'comments_and_reactions/comments.json'
  const content = {
    comments_v2: [
      { timestamp: 1000000000, comment: 'one comment' },
      { timestamp: 1000000001, comment: 'another comment', name: 'hello' }
    ]
  }
  const fileManager = await mockFileManager(fileName, JSON.stringify(content))

  const options = {
    accessor: {
      filePath: 'comments_and_reactions/comments.json',
      jsonPath: '$.comments_v2[*]'
    }
  }

  expect(fileManager.hasFile(fileName)).toBe(true)
  const bobo = await fileManager.getText(fileName)
  expect(bobo).toStrictEqual(JSON.stringify(content))

  const tableData = await jsonToTableConverter({ fileManager, options })
  const correct = {
    headers: ['timestamp', 'comment', 'name'],
    items: content.comments_v2
  }
  expect(tableData).toStrictEqual(correct)
})
