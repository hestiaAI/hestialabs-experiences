import { ExperienceOptions } from '@/types'

import fs from 'fs'

import NodeFile from '@hestia.ai/data-experience/src/utils/node-file.js'
import FileManager from '@hestia.ai/data-experience/src/utils/file-manager'

export async function createFiles(files: string[] | undefined) {
  if (files) {
    const nodeFiles = await Promise.all(
      files.map(filename => {
        const buffer = fs.promises.readFile(filename)
        const content = filename.endsWith('.zip') ? buffer : buffer.toString()
        return new NodeFile(filename, content)
      })
    )
    return nodeFiles
  }
  return []
}

export async function createAndInitializeFileManager(
  options: ExperienceOptions,
  nodeFiles: NodeFile[]
) {
  const fileManager = new FileManager(
    options.preprocessors,
    null,
    options.files,
    options.keepOnlyFiles
  )

  await fileManager.init(nodeFiles)

  return fileManager
}
