import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'
import { arrayEqualNoOrder } from '~/utils/test-utils'

test('an empty file manager', async () => {
  const fileManager = new FileManager({})
  fileManager.init([], false)
  await expect(() => fileManager.getText('bobo.json')).rejects.toThrow()
})

test('a json file in file manager', async () => {
  const fileManager = new FileManager({})
  const fileName = 'bibi/bobo.json'
  const file = mockFile(fileName, '{"hello": 1}')
  await fileManager.init([file], true)

  expect(fileManager.hasFile(fileName)).toBe(true)
  const bobo = await fileManager.getText(fileName)
  expect(bobo).toStrictEqual('{"hello": 1}')
})

test('findMatchingFilePaths', async () => {
  const fileManager = new FileManager({})
  const fileName1 = 'bibi/bubo.json'
  const fileContent = '{"hello": [11,22,33]}'
  const file1 = mockFile(fileName1, fileContent)
  const fileName2 = 'bibi/bibo.json'
  const file2 = mockFile(fileName2, fileContent)
  await fileManager.init([file1, file2], true)

  let paths = fileManager.findMatchingFilePaths('**/b*bo.json')
  expect(paths).toStrictEqual([fileName1, fileName2])

  paths = fileManager.findMatchingFilePaths('**/bi*.json')
  expect(paths).toStrictEqual([fileName2])

  paths = fileManager.findMatchingFilePaths('**/xx.json')
  expect(paths).toStrictEqual([])
})

test('findMatchingObjects', async () => {
  const fileManager = new FileManager({})
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

test('short filenames', async () => {
  const fileManager = new FileManager({})
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

test('files are filtered', async () => {
  const fileManager = new FileManager({})
  const f1 = mockFile('__MACOSX/ignored.txt', '')
  const f2 = mockFile('test/.DS_STORE', '')
  const f3 = mockFile('test/.DS_Store', '')
  await fileManager.init([f1, f2, f3], true)

  expect(fileManager.hasFile(f1)).toBeFalsy()
  expect(fileManager.hasFile(f2)).toBeFalsy()
  expect(fileManager.hasFile(f3)).toBeFalsy()
})

test('files from IDs', async () => {
  const fileManager = new FileManager({})
  const content = 'hello world'

  const id1 = 'foobar'
  const path1 = 'foo/bar.txt'
  const file1 = mockFile(path1, content)

  const id2 = 'hello'
  const path2 = 'test/hello.txt'
  const file2 = mockFile(path2, content)

  const id3 = 'all'
  const ids = {
    [id1]: '**/bar.txt',
    [id2]: '**/hello.txt',
    [id3]: '**/*.txt'
  }
  await fileManager.init([file1, file2], true, ids)

  let path, text
  path = fileManager.getFilePathsFromId(id1, true)
  expect(path).toStrictEqual(path1)
  text = await fileManager.getPreprocessedTextFromId(id1, true)
  expect(text).toStrictEqual(content)

  path = fileManager.getFilePathsFromId(id2, true)
  expect(path).toStrictEqual(path2)
  text = await fileManager.getPreprocessedTextFromId(id2, true)
  expect(text).toStrictEqual(content)

  const paths = fileManager.getFilePathsFromId(id3, false)
  arrayEqualNoOrder(paths, [path1, path2])

  expect(fileManager.getFilePathsFromId('wrong-id', true)).toBe(null)
})
