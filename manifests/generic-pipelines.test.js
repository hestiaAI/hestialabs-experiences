import {
  jsonToTableConverter,
  mergeTableData
} from '~/manifests/generic-pipelines'
import { mockFileManager } from '~/utils/__mocks__/file-manager-mock'

test('mergeTableData', () => {
  const t1 = {
    headers: ['Timestamp', 'First'],
    items: [
      { Timestamp: 1000000000, First: 'one comment' },
      { Timestamp: 1000000001, First: 'another comment' }
    ]
  }
  const t2 = {
    headers: ['Timestamp', 'Second'],
    items: [
      { Timestamp: 2000000000, Second: 'one sec comment' },
      { Timestamp: 2000000001, Second: 'another sec comment' }
    ]
  }
  const merged = mergeTableData([t1, t2])
  const correct = {
    headers: ['Timestamp', 'First', 'Second'],
    items: [
      { Timestamp: 1000000000, First: 'one comment' },
      { Timestamp: 1000000001, First: 'another comment' },
      { Timestamp: 2000000000, Second: 'one sec comment' },
      { Timestamp: 2000000001, Second: 'another sec comment' }
    ]
  }
  expect(merged).toStrictEqual(correct)
})

test('mergeTableData empty', () => {
  const t1 = {
    headers: [],
    items: [
      { Timestamp: 1000000000, First: 'one comment' },
      { Timestamp: 1000000001, First: 'another comment' }
    ]
  }
  const t2 = {
    headers: ['Timestamp', 'Second'],
    items: []
  }
  const merged = mergeTableData([t1, t2])
  const correct = {
    headers: [],
    items: []
  }
  expect(merged).toStrictEqual(correct)
})

test('jsonToTableConverter with properties', async () => {
  const fileName = 'comments_and_reactions/comments.json'
  const content = {
    comments_v2: [
      { timestamp: 1000000000, comment: 'one comment', name: 'hello' },
      { timestamp: 1000000001, comment: 'another comment', name: 'toto' }
    ]
  }
  const fileManager = await mockFileManager(fileName, JSON.stringify(content))

  const options = [
    {
      accessor: {
        filePath: 'comments_and_reactions/comments.json',
        jsonPath: '$.comments_v2[*]'
      },
      columns: [
        {
          name: 'Timestamp',
          path: 'timestamp',
          type: 'number'
        },
        {
          name: 'First comment',
          path: 'comment'
        }
      ]
    }
  ]

  expect(fileManager.hasFile(fileName)).toBe(true)
  const bobo = await fileManager.getText(fileName)
  expect(bobo).toStrictEqual(JSON.stringify(content))

  const tableData = await jsonToTableConverter({ fileManager, options })
  const correct = {
    headers: ['Timestamp', 'First comment'],
    items: [
      { Timestamp: 1000000000, 'First comment': 'one comment' },
      { Timestamp: 1000000001, 'First comment': 'another comment' }
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

  const options = [
    {
      accessor: {
        filePath: 'comments_and_reactions/comments.json',
        jsonPath: '$.comments_v2[*]'
      }
    }
  ]

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

  const options = [
    {
      accessor: {
        filePath: 'comments_and_reactions/comments.json',
        jsonPath: '$.comments_v2[*]'
      }
    }
  ]

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

test('jsonToTableConverter without properties and incorrect accessor', async () => {
  const fileName = 'comments_and_reactions/comments.json'
  const content = {
    comments_v2: [
      { timestamp: 1000000000, comment: 'one comment' },
      { timestamp: 1000000001, comment: 'another comment', name: 'hello' }
    ]
  }
  const fileManager = await mockFileManager(fileName, JSON.stringify(content))

  const options = [
    {
      accessor: {
        filePath: 'comments_and_reactions/comments.json',
        jsonPath: '$.comments_v2[*].blele'
      }
    }
  ]

  expect(fileManager.hasFile(fileName)).toBe(true)
  const bobo = await fileManager.getText(fileName)
  expect(bobo).toStrictEqual(JSON.stringify(content))

  const tableData = await jsonToTableConverter({ fileManager, options })
  const correct = { headers: [], items: [] }
  // expect(true).toStrictEqual(false)
  expect(tableData).toStrictEqual(correct)
})
