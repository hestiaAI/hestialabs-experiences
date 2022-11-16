import fs from 'fs'
import util from 'util'
import stream from 'stream'
import JSZip from 'jszip'
import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'
import { arrayEqualNoOrder } from '~/utils/test-utils'
import { itemifyJSON } from '~/utils/json'
import { getCsvHeadersAndItems } from '~/utils/csv'

test('an empty file manager', async() => {
  const fileManager = new FileManager()
  fileManager.init([])
  await expect(() => fileManager.getText('bobo.json')).rejects.toThrow()
})

function deleteFileIfExists(fileName) {
  if (fs.existsSync(fileName)) {
    fs.unlinkSync(fileName)
  }
}

async function storeAsZipFile(zipFileName, fileName, content) {
  const zip = new JSZip()
  zip.file(fileName, content)
  const pipeline = util.promisify(stream.pipeline)
  return await pipeline(
    zip
      .generateNodeStream({ type: 'nodebuffer', streamFiles: true }),
    fs.createWriteStream(zipFileName)
  )
}

test('extractZips with unzipped file', async() => {
  const fileName = 'bibi/bobo.json'
  const content = '{"hello": 1}'
  const file = new NodeFile(fileName, content)
  const extracted = await FileManager.extractZips([file], /bobo/)
  expect(extracted.length).toEqual(1)
  expect(extracted[0]).toEqual(file)
})

test('extractZips with zipped file', async() => {
  const fileName = 'bibi/bobo.json'
  const content = '{"hello": 1}'
  const zipFileName = 'test-extractZips.zip'
  try {
    deleteFileIfExists(zipFileName)
    await storeAsZipFile(zipFileName, fileName, content)
    const zipContent = fs.readFileSync(zipFileName)
    const file = new NodeFile(zipFileName, zipContent)
    const extracted = await FileManager.extractZips([file], /bobo/)
    expect(extracted.length).toEqual(1)
    expect(extracted[0]).toEqual(file)
  } finally {
    deleteFileIfExists(zipFileName)
  }
})
test('removeZipName', () => {
  const fileName = 'test-removeZipName.zip/bibi/bobo.json'
  const content = '{"hello": 1}'
  const file = new NodeFile(fileName, content)
  const removed = FileManager.removeZipName([file])
  expect(removed.length).toEqual(1)
  expect(removed[0].name).toEqual('bibi/bobo.json')
  expect(removed[0].text()).toEqual(content)
})

test('a json file in file manager', async() => {
  const fileManager = new FileManager()
  const fileName = 'bibi/bobo.json'
  const content = '{"hello": 1}'
  const file = new NodeFile(fileName, content)
  await fileManager.init([file])

  expect(fileManager.hasFile(fileName)).toBeTruthy()

  const text = await fileManager.getText(fileName)
  expect(text).toStrictEqual(content)

  const processedText = await fileManager.getPreprocessedText(fileName)
  expect(processedText).toStrictEqual(content)

  const result = await fileManager.getJsonItems(fileName)
  const expected = itemifyJSON(content)
  expect(result).toEqual(expected)
})

test('a csv file in file manager', async() => {
  const fileManager = new FileManager()
  const fileName = 'test.csv'
  const content = 'col1,col2\nhello,world\nfoo,bar'
  const file = new NodeFile(fileName, content)
  await fileManager.init([file])

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

test('findMatchingFilePaths', async() => {
  const fileManager = new FileManager()
  const fileName1 = 'bibi/bubo.json'
  const fileContent = '{"hello": [11,22,33]}'
  const file1 = new NodeFile(fileName1, fileContent)
  const fileName2 = 'bibi/bibo.json'
  const file2 = new NodeFile(fileName2, fileContent)
  await fileManager.init([file1, file2])

  let paths = fileManager.findMatchingFilePaths('**/b*bo.json')
  expect(paths).toStrictEqual([fileName1, fileName2])

  paths = fileManager.findMatchingFilePaths('**/bi*.json')
  expect(paths).toStrictEqual([fileName2])

  paths = fileManager.findMatchingFilePaths('**/xx.json')
  expect(paths).toStrictEqual([])
})

test('findMatchingObjects', async() => {
  const fileManager = new FileManager()
  const fileName = 'bibi/bubo.json'
  const fileContent = '{"hello": [11,22,33]}'
  const file = new NodeFile(fileName, fileContent)
  await fileManager.init([file])

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

test('short filenames', async() => {
  const fileManager = new FileManager()
  const f1 = 'foo/bar.txt'
  const f2 = 'foo/toc.txt'
  const f3 = 'bar.txt'
  const f4 = 'test/hello/bar.txt'
  const f5 = 'zip.zip/toc.json'
  await fileManager.init([
    new NodeFile(f1, ''),
    new NodeFile(f2, ''),
    new NodeFile(f3, ''),
    new NodeFile(f4, ''),
    new NodeFile(f5, '')
  ])
  expect(fileManager.getShortFilename(f1)).toMatch('foo/bar.txt')
  expect(fileManager.getShortFilename(f2)).toMatch('toc.txt')
  expect(fileManager.getShortFilename(f3)).toMatch('bar.txt')
  expect(fileManager.getShortFilename(f4)).toMatch('hello/bar.txt')
  expect(fileManager.getShortFilename(f5)).toMatch('toc.json')
})

test('getFileNames', async() => {
  const fileManager = new FileManager()
  const f1 = 'foo/bar.txt'
  const f2 = 'foo/toc.txt'
  await fileManager.init([new NodeFile(f1, '1'), new NodeFile(f2, '2')])
  expect(fileManager.getFilenames()).toStrictEqual([f1, f2])
})

test('files are filtered', async() => {
  const fileManager = new FileManager()
  const f1 = new NodeFile('__MACOSX/ignored.txt', '')
  const f2 = new NodeFile('test/.DS_STORE', '')
  const f3 = new NodeFile('test/.DS_Store', '')
  await fileManager.init([f1, f2, f3])

  expect(fileManager.hasFile(f1)).toBeFalsy()
  expect(fileManager.hasFile(f2)).toBeFalsy()
  expect(fileManager.hasFile(f3)).toBeFalsy()
})

test('files from IDs', async() => {
  const content = 'hello world'

  const id1 = 'foobar'
  const path1 = 'foo/bar.txt'
  const file1 = new NodeFile(path1, content)

  const id2 = 'hello'
  const path2 = 'test/hello.txt'
  const file2 = new NodeFile(path2, content)

  const id3 = 'all'
  const id4 = 'not-found'
  const ids = {
    [id1]: '**/bar.txt',
    [id2]: '**/hello.txt',
    [id3]: '**/*.txt',
    [id4]: '*.unknown'
  }
  const fileManager = new FileManager(null, null, ids)
  await fileManager.init([file1, file2])

  let path, text
  path = fileManager.getFilePathsFromId(id1)
  expect(path).toEqual([path1])
  text = await fileManager.getPreprocessedTextFromId(id1)
  expect(text).toEqual([content])

  path = fileManager.getFilePathsFromId(id2)
  expect(path).toEqual([path2])
  text = await fileManager.getPreprocessedTextFromId(id2)
  expect(text).toEqual([content])

  const paths = fileManager.getFilePathsFromId(id3)
  arrayEqualNoOrder(paths, [path1, path2])

  expect(() => fileManager.getFilePathsFromId('wrong-id')).toThrow()

  expect(fileManager.getFilePathsFromId(id4)).toEqual([])
})
