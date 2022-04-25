type CustomPipelineOptions = object | object[]

import type { PipelineOutput } from './utils'

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
  key: string
  postprocessor?(input: PipelineOutput): PipelineOutput
  showTable?: boolean
  sql?: string
  text: string
  title: string
  visualization?: string
  vizProps?: object
}

export type ViewBlocks = ViewBlock[]
