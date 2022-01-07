import FileManager from '~/utils/file-manager'

export function mockFile(fileName, content) {
  // browser files are different from node files
  return { name: fileName, text: () => Promise.resolve(content) }
}

export async function mockFileManager(fileName, content) {
  const fileManager = new FileManager({}, true)
  const file = mockFile(fileName, content)
  await fileManager.init([file], true)
  return fileManager
}
