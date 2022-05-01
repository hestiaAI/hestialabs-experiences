type CustomPipelineOptions = object | object[]

import type { FileManager, PipelineOutput } from './utils'
export type PostprocessorFunction = (input: PipelineOutput) => PipelineOutput

export type ViewBlock = {
  customPipeline?:
    | string
    | ((params: {
        fileManager: FileManager
        options?: CustomPipelineOptions
      }) => Promise<PipelineOutput | { rawCsv: string; config: object }>)
  customPipelineOptions?: CustomPipelineOptions
  files?: string[]
  id: string
  postprocessor?: PostprocessorFunction
  showTable?: boolean
  sql?: string
  text: string
  title: string
  visualization?: string | object
  vizProps?: object
}

export type ViewBlocks = ViewBlock[]
