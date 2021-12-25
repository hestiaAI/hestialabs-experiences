import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/file-manager-mock'

test('an empty file manager', async () => {
  const fileManager = new FileManager({}, true)
  fileManager.init([], false)
  const bobo = await fileManager.getText('bobo.json')
  expect(bobo).toStrictEqual('{}')
})

test('a json file in file manager', async () => {
  const fileManager = new FileManager({}, true)
  const fileName = 'bibi/bobo.json'
  const file = mockFile(fileName, '{"hello": 1}')
  await fileManager.init([file], true)

  expect(fileManager.hasFile(fileName)).toBe(true)
  const bobo = await fileManager.getText(fileName)
  expect(bobo).toStrictEqual('{"hello": 1}')
})

test('findMatchingObjects', async () => {
  const fileManager = new FileManager({}, true)
  const fileName = 'bibi/bubo.json'
  const fileContent = '{"hello": [11,22,33]}'
  const file = mockFile(fileName, fileContent)
  await fileManager.init([file], true)

  expect(fileManager.hasFile(fileName)).toBe(true)
  const bobo = await fileManager.getText(fileName)
  expect(bobo).toStrictEqual(fileContent)

  let accessor = { filePath: '**/bu*o.json' }
  let matching = await fileManager.findMatchingObjects(accessor)
  const jsonContent = JSON.parse(fileContent)
  expect(matching[0]).toStrictEqual(jsonContent)

  accessor = { filePath: '**/bu*o.json', jsonPath: 'hello[1]' }
  matching = await fileManager.findMatchingObjects(accessor)
  expect(matching[0]).toStrictEqual(22)
})
