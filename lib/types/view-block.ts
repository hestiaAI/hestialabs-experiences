type CustomPipelineOptions = object | object[]

import type { PipelineOutput } from './utils'
export type PostprocessorFunction = (input: PipelineOutput) => PipelineOutput

export type ViewBlock = {
  customPipeline?:
    | string
    | (({
        fileManager: object,
        parameter: string,
        options: CustomPipelineOptions
      }) => Promise<PipelineOutput>)
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
