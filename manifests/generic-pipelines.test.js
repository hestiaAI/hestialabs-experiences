import { jsonToTableConverter } from '~/manifests/generic-pipelines'
import { mockFileManager } from '~/utils/file-manager.test'

test('jsonToTableConverter', async () => {
  const fileName = 'comments_and_reactions/comments.json'
  const content = {
    comments_v2: [
      { timestamp: 1000000000, comment: 'one comment' },
      { timestamp: 1000000001, comment: 'another comment' }
    ]
  }
  const fileManager = await mockFileManager(fileName, JSON.stringify(content))

  const options = {
    accessor: {
      filePath: 'comments_and_reactions/comments.json',
      jsonPath: '$.comments_v2[*]'
    },
    properties: [
      {
        name: 'Timestamp',
        field: 'timestamp',
        type: 'number',
        required: true
      },
      {
        name: 'First comment',
        field: 'comment',
        type: 'string',
        required: true
      }
    ]
  }

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
