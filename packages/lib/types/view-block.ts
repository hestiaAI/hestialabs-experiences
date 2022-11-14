type CustomPipelineOptions = object | object[]

import type { FileManager, PipelineOutput } from './utils'
export type PostprocessorFunction = (input: PipelineOutput) => PipelineOutput
export type CustomPipeline = (params: {
  fileManager: FileManager
  options?: CustomPipelineOptions
}) => Promise<PipelineOutput | { rawCsv: string; config: object }>

export type ViewBlock = {
  customPipeline?: string | CustomPipeline
  customPipelineOptions?: CustomPipelineOptions
  files?: string[]
  id: string
  image?: string
  overlay?: string
  postprocessor?: PostprocessorFunction
  showTable?: boolean
  sql?: string
  text: string
  title: string
  visualization?: string | object
  vizProps?: object
}

export type ViewBlocks = ViewBlock[]
