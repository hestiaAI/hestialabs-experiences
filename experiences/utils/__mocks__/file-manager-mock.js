import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'

export function mockFile(fileName, content) {
  // browser files are different from node files
  // return { name: fileName, text: () => Promise.resolve(content) }
  return new NodeFile(content, fileName)
}

export async function mockFileManager(fileName, content) {
  const fileManager = new FileManager()
  const file = mockFile(fileName, content)
  await fileManager.init([file])
  return fileManager
}
