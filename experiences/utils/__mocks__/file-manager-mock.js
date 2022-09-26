import FileManager, { NodeFile } from '~/utils/file-manager'

export async function mockFileManager(fileName, content) {
  const fileManager = new FileManager()
  const file = new NodeFile(fileName, content)
  await fileManager.init([file])
  return fileManager
}
