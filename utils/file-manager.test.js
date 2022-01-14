import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'
import { arrayEqualNoOrder } from '~/utils/test-utils'
import itemifyJSON from '~/utils/json'
import getCsvHeadersAndItems from '~/utils/csv'

test('an empty file manager', async () => {
  const fileManager = new FileManager({}, true)
  fileManager.init([], false)
  const bobo = await fileManager.getText('bobo.json')
  expect(bobo).toStrictEqual('{}')
})

test('a json file in file manager', async () => {
  const fileManager = new FileManager({}, true)
  const fileName = 'bibi/bobo.json'
  const content = '{"hello": 1}'
  const file = mockFile(fileName, content)
  await fileManager.init([file], true)

  expect(fileManager.hasFile(fileName)).toBeTruthy()

  const text = await fileManager.getText(fileName)
  expect(text).toStrictEqual(content)

  const processedText = await fileManager.getPreprocessedText(fileName)
  expect(processedText).toStrictEqual(content)

  const result = await fileManager.getJsonItems(fileName)
  const expected = itemifyJSON(content)
  expect(result).toEqual(expected)
})

test('a csv file in file manager', async () => {
  const fileManager = new FileManager({}, true)
  const fileName = 'test.csv'
  const content = 'col1,col2\nhello,world\nfoo,bar'
  const file = mockFile(fileName, content)
  await fileManager.init([file], true)

  expect(fileManager.hasFile(fileName)).toBeTruthy()

  const text = await fileManager.getText(fileName)
  expect(text).toStrictEqual(content)

  const processedText = await fileManager.getPreprocessedText(fileName)
  expect(processedText).toStrictEqual(content)

  const result = await fileManager.getCsvItems(fileName)
  const expected = await getCsvHeadersAndItems(content)
  arrayEqualNoOrder(result.headers, expected.headers)
  arrayEqualNoOrder(result.items, expected.items)
})

test('findMatchingObjects', async () => {
  const fileManager = new FileManager({}, true)
  const fileName = 'bibi/bubo.json'
  const fileContent = '{"hello": [11,22,33]}'
  const file = mockFile(fileName, fileContent)
  await fileManager.init([file], true)

  expect(fileManager.hasFile(fileName)).toBeTruthy()
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

test('short filenames', async () => {
  const fileManager = new FileManager({}, true)
  const f1 = 'foo/bar.txt'
  const f2 = 'foo/toc.txt'
  const f3 = 'bar.txt'
  const f4 = 'test/hello/bar.txt'
  const f5 = 'zip.zip/toc.json'
  await fileManager.init(
    [
      mockFile(f1, ''),
      mockFile(f2, ''),
      mockFile(f3, ''),
      mockFile(f4, ''),
      mockFile(f5, '')
    ],
    true
  )
  expect(fileManager.getShortFilename(f1)).toMatch('foo/bar.txt')
  expect(fileManager.getShortFilename(f2)).toMatch('toc.txt')
  expect(fileManager.getShortFilename(f3)).toMatch('bar.txt')
  expect(fileManager.getShortFilename(f4)).toMatch('hello/bar.txt')
  expect(fileManager.getShortFilename(f5)).toMatch('toc.json')
})
