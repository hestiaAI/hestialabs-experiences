import FileManager from '~/utils/file-manager'
import NodeFile from '~/utils/node-file'

export async function mockFileManager(fileName, content) {
  const fileManager = new FileManager()
  const file = new NodeFile(fileName, content)
  await fileManager.init([file])
  return fileManager
}
